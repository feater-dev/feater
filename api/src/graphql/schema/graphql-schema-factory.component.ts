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

@Component()
export class GraphqlSchemaFactory {
    constructor(
        @Inject('TypeDefsProvider') private readonly typeDefsProvider,
        private readonly usersResolverFactory: UsersResolverFactory,
        private readonly projectsResolverFactory: ProjectsResolverFactory,
        private readonly definitionResolverFactory: DefinitionResolverFactory,
        private readonly instanceResolverFactory: InstanceResolverFactory,
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
                users: this.usersResolverFactory.getListResolver(),
                projects: this.projectsResolverFactory.getListResolver(),
                definitions: this.definitionResolverFactory.getListResolver(),
                instances: this.instanceResolverFactory.getListResolver(),
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
                    (definitionType: DefinitionTypeInterface) => definitionType.projectId,
                ),
                instances: this.instanceResolverFactory.getListResolver(
                    (definition: DefinitionTypeInterface) => ({definitionId: definition.id}),
                ),
            },

            Instance: {
                definition: this.definitionResolverFactory.getItemResolver(
                    (instance: InstanceTypeInterface) => instance.definitionId,
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
