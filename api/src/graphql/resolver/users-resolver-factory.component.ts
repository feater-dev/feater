import {Component} from '@nestjs/common';
import {UserRepository} from '../../persistence/repository/user.repository';
import {UserTypeInterface} from '../type/user-type.interface';
import {UserInterface} from '../../persistence/interface/user.interface';
import {GithubProfileTypeInterface} from '../type/nested/user-profile/github-profile-type.interface';
import {GoogleProfileTypeInterface} from '../type/nested/user-profile/google-profile-type.interface';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverUserFilterArgumentsInterface} from './filter-argument/resolver-user-filter-arguments.interface';
import * as escapeStringRegexp from 'escape-string-regexp';

@Component()
export class UsersResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly userRepository: UserRepository,
    ) { }

    protected readonly defaultSortKey = 'name_asc';

    protected readonly sortMap = {
        name_asc: {
            name: 'asc',
            createdAt: 'desc',
            _id: 'desc',
        },
        name_desc: {
            name: 'desc',
            createdAt: 'desc',
            _id: 'desc',
        },
        created_at_asc: {
            createdAt: 'asc',
            _id: 'desc',
        },
        created_at_desc: {
            createdAt: 'desc',
            _id: 'desc',
        },
    };

    public getListResolver(queryExtractor?: (object: object) => object): (object: object, args: object) => Promise<UserTypeInterface[]> {
        return async (object: object, args: object): Promise<UserTypeInterface[]> => {
            const resolverListOptions = args as ResolverPaginationArgumentsInterface;
            const criteria = this.applyFilterArgumentToCriteria(
                queryExtractor ? queryExtractor(object) : {},
                args as ResolverUserFilterArgumentsInterface,
            );
            const users = await this.userRepository.find(
                criteria,
                this.resolveListOptionsHelper.getOffset(resolverListOptions.offset),
                this.resolveListOptionsHelper.getLimit(resolverListOptions.limit),
                this.resolveListOptionsHelper.getSort(this.defaultSortKey, this.sortMap, resolverListOptions.sortKey),
            );
            const data: UserTypeInterface[] = [];
            for (const user of users) {
                data.push(this.mapPersistentModelToTypeModel(user));
            }

            return data;
        };
    }

    public createItemResolver(idExtractor: (any) => string): (string) => Promise<UserTypeInterface> {
        return async (object: any): Promise<UserTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.userRepository.findById(idExtractor(object)),
            );
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverUserFilterArgumentsInterface): object {
        if (args.name) {
            criteria.name = new RegExp(escapeStringRegexp(args.name));
        }

        return criteria;
    }

    protected getSort(sortKey: string): object {
        if (!this.sortMap[sortKey]) {
            throw new Error();
        }

        return this.sortMap[sortKey];
    }

    protected mapPersistentModelToTypeModel(user: UserInterface): UserTypeInterface {
        return {
            id: user._id,
            name: user.name,
            githubProfile: user.githubProfile.id
                ? user.githubProfile as GithubProfileTypeInterface
                : null,
            googleProfile: user.googleProfile.id
                ? user.googleProfile as GoogleProfileTypeInterface
                : null,
        } as UserTypeInterface;
    }
}
