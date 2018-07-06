import {Component, Inject} from '@nestjs/common';
import {GraphQLSchema} from 'graphql';
import * as GraphQLJSON from 'graphql-type-json';
import {makeExecutableSchema} from 'graphql-tools';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {InstanceTypeInterface} from '../type/instance-type.interface';
import {ProjectsResolverFactory} from '../resolver/projects-resolver-factory.component';
import {DefinitionResolverFactory} from '../resolver/definition-resolver-factory.component';
import {InstanceResolverFactory} from '../resolver/instance-resolver-factory.component';
import {BeforeBuildTaskTypeInterface} from '../type/nested/definition-config/before-build-task-type.interface';
import {UsersResolverFactory} from '../resolver/users-resolver-factory.component';
import {DateResolverFactory} from '../resolver/date-resolver-factory.component';
import {PublicSshKeyResolverFactory} from '../resolver/public-ssh-key-resolver-factory.component';

@Component()
export class GraphqlSchemaFactory {
    constructor(
        @Inject('TypeDefsProvider') private readonly typeDefsProvider,
        private readonly publicSshKeyResolverFactory: PublicSshKeyResolverFactory,
        private readonly usersResolverFactory: UsersResolverFactory,
        private readonly projectsResolverFactory: ProjectsResolverFactory,
        private readonly definitionResolverFactory: DefinitionResolverFactory,
        private readonly instanceResolverFactory: InstanceResolverFactory,
        private readonly dateResolverFactory: DateResolverFactory,
    ) { }

    public createSchema(): GraphQLSchema {
        return makeExecutableSchema({
            typeDefs: this.typeDefsProvider,
            resolvers: this.createResolvers(),
        });
    }

    protected createResolvers(): any {
        return {
            JSON: GraphQLJSON,

            Query: {
                publicSshKey: this.publicSshKeyResolverFactory.getResolver(),
                users: this.usersResolverFactory.getListResolver(),
                projects: this.projectsResolverFactory.getListResolver(),
                project: this.projectsResolverFactory.getItemResolver(
                    (obj: any, args: any): string => args.id,
                ),
                definitions: this.definitionResolverFactory.getListResolver(),
                definition: this.definitionResolverFactory.getItemResolver(
                    (obj: any, args: any): string => args.id,
                ),
                instances: this.instanceResolverFactory.getListResolver(),
                instance: this.instanceResolverFactory.getItemResolver(
                    (obj: any, args: any): string => args.id,
                ),
            },

            Mutation: {
                createProject: this.projectsResolverFactory.getCreateItemResolver(),
                createDefinition: this.definitionResolverFactory.getCreateItemResolver(),
                createInstance: this.instanceResolverFactory.getCreateItemResolver(),
                removeInstance: this.instanceResolverFactory.getRemoveItemResolver(),
            },

            Project: {
                definitions: this.definitionResolverFactory.getListResolver(
                    (project: ProjectTypeInterface) => ({projectId: project.id}),
                ),
            },

            Definition: {
                project: this.projectsResolverFactory.getItemResolver(
                    (definition: DefinitionTypeInterface) => definition.projectId,
                ),
                instances: this.instanceResolverFactory.getListResolver(
                    (definition: DefinitionTypeInterface) => ({definitionId: definition.id}),
                ),
            },

            Instance: {
                definition: this.definitionResolverFactory.getItemResolver(
                    (instance: InstanceTypeInterface) => instance.definitionId,
                ),
                createdAt: this.dateResolverFactory.getResolver(
                    (instance: InstanceTypeInterface) => instance.createdAt,
                ),
            },

            BeforeBuildTask: {
                __resolveType: (beforeBuildTask: BeforeBuildTaskTypeInterface): string => {
                    if ('copy' === beforeBuildTask.type) {
                        return 'CopyBeforeBuildTask';
                    }
                    if ('interpolate' === beforeBuildTask.type) {
                        return 'InterpolateBeforeBuildTask';
                    }
                    throw new Error();
                },
            },
        };
    }
}
