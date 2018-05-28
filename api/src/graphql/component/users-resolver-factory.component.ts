import {Component} from '@nestjs/common';
import {UserRepository} from '../../persistence/repository/user.repository';
import {UserTypeInterface} from '../type/user-type.interface';
import {UserInterface} from '../../persistence/interface/user.interface';
import {GithubProfileTypeInterface} from '../type/github-profile-type.interface';
import {GoogleProfileTypeInterface} from '../type/google-profile-type.interface';

@Component()
export class UsersResolverFactory {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    public createRootListResolver(): () => Promise<Array<UserTypeInterface>> {
        return async (): Promise<Array<UserTypeInterface>> => {
            const users = await this.userRepository.find({});

            return users.map(
                (user: UserInterface): UserTypeInterface => {
                    return this.mapPersistentModelToTypeModel(user);
                },
            );
        };
    }

    public createItemResolver(idExtractor: (any) => string): (string) => Promise<UserTypeInterface> {
        return async (object: any): Promise<UserTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.userRepository.findById(idExtractor(object)),
            );
        };
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
