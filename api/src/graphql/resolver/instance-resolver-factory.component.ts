import {Component} from '@nestjs/common';
import {InstanceTypeInterface} from '../type/instance-type.interface';
import {InstanceRepository} from '../../persistence/repository/instance.repository';
import {InstanceInterface} from '../../persistence/interface/instance.interface';
import {CreateInstanceInputTypeInterface} from '../input-type/create-instance-input-type.interface';
import {RemoveInstanceInputTypeInterface} from '../input-type/remove-instance-input-type.interface';
import {Instantiator} from '../../instantiation/instantiator.component';
import {DefinitionRepository} from '../../persistence/repository/definition.repository';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverInstanceFilterArgumentsInterface} from './filter-argument/resolver-instance-filter-arguments.interface';
import * as nanoidGenerate from 'nanoid/generate';
import * as escapeStringRegexp from 'escape-string-regexp';

@Component()
export class InstanceResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly instanceRepository: InstanceRepository,
        private readonly definitionRepository: DefinitionRepository,
        private readonly instantiator: Instantiator,
    ) { }

    protected readonly defaultSortKey = 'name_asc';

    readonly sortMap = {
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

    public getListResolver(queryExtractor?: (obj: any, args: any) => any): (obj: any, args: any) => Promise<InstanceTypeInterface[]> {
        return async (obj: any, args: any): Promise<InstanceTypeInterface[]> => {
            const resolverListOptions = args as ResolverPaginationArgumentsInterface;
            const criteria = this.applyFilterArgumentToCriteria(
                queryExtractor ? queryExtractor(obj, args) : {},
                args as ResolverInstanceFilterArgumentsInterface,
            );
            const instances = await this.instanceRepository.find(
                criteria,
                this.resolveListOptionsHelper.getOffset(resolverListOptions.offset),
                this.resolveListOptionsHelper.getLimit(resolverListOptions.limit),
                this.resolveListOptionsHelper.getSort(this.defaultSortKey, this.sortMap, resolverListOptions.sortKey),
            );
            const data: InstanceTypeInterface[] = [];
            for (const instance of instances) {
                data.push(this.mapPersistentModelToTypeModel(instance));
            }

            return data;
        };
    }

    public getItemResolver(idExtractor: (obj: any, args: any) => string): (obj: any, args: any) => Promise<InstanceTypeInterface> {
        return async (obj: any, args: any): Promise<InstanceTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.instanceRepository.findById(idExtractor(obj, args)),
            );
        };
    }

    public getCreateItemResolver(): (obj: any, createInstanceInput: CreateInstanceInputTypeInterface) => Promise<InstanceTypeInterface> {
        return async (obj: any, createInstanceInput: CreateInstanceInputTypeInterface): Promise<InstanceTypeInterface> => {
            // TODO Add validation.
            const instance = await this.instanceRepository.create(createInstanceInput);
            const definition = await this.definitionRepository.findByIdOrFail(instance.definitionId);
            const hash = nanoidGenerate('0123456789abcdefghijklmnopqrstuvwxyz', 8);

            process.nextTick(() => {
                const build = this.instantiator.createBuild(
                    instance._id.toString(),
                    hash,
                    definition,
                );
                this.instantiator.instantiateBuild(build);
            });

            return this.mapPersistentModelToTypeModel(instance);
        };
    }

    public getRemoveItemResolver(): (obj: any, removeInstanceInput: RemoveInstanceInputTypeInterface) => Promise<boolean> {
        return async (obj: any, removeInstanceInput: RemoveInstanceInputTypeInterface): Promise<boolean> => {
            // TODO Should also remove files, proxies, volumes, networks...

            return await this.instanceRepository.remove(removeInstanceInput.id);
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverInstanceFilterArgumentsInterface): object {
        if (args.name) {
            criteria.name = new RegExp(escapeStringRegexp(args.name));
        }
        if (args.projectId) {
            criteria.projectId = args.projectId;
        }
        if (args.definitionId) {
            criteria.definitionId = args.definitionId;
        }

        return criteria;
    }

    protected mapPersistentModelToTypeModel(instance: InstanceInterface): InstanceTypeInterface {
        const mapped = {
            id: instance._id,
            name: instance.name,
            definitionId: instance.definitionId,
            services: instance.services,
            summaryItems: instance.summaryItems,
            envVariables: instance.envVariables,
            proxiedPorts: instance.proxiedPorts,
            createdAt: instance.createdAt,
        } as InstanceTypeInterface;

        return mapped;
    }
}
