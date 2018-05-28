import {Component, Inject} from '@nestjs/common';
import {GraphQLSchema} from 'graphql';
import * as GraphQLJSON from 'graphql-type-json';
import {makeExecutableSchema} from 'graphql-tools';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {BuildDefinitionTypeInterface} from '../type/build-definition-type.interface';
import {BuildInstanceTypeInterface} from '../type/build-instance-type.interface';
import {ProjectsResolverFactory} from './projects-resolver-factory.component';
import {BuildDefinitionResolverFactory} from './build-definition-resolver-factory.component';
import {BuildInstanceResolverFactory} from './build-instance-resolver-factory.component';
import {BeforeBuildTaskTypeInterface} from '../type/before-build-task-type.interface';
import {UsersResolverFactory} from './users-resolver-factory.component';

@Component()
export class GraphqlService {
    constructor(
        @Inject('TypeDefsProvider') private readonly typeDefsProvider,
        private readonly usersResolverFactory: UsersResolverFactory,
        private readonly projectsResolverFactory: ProjectsResolverFactory,
        private readonly buildDefinitionResolverFactory: BuildDefinitionResolverFactory,
        private readonly buildInstanceResolverFactory: BuildInstanceResolverFactory,
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
                buildDefinitions: this.buildDefinitionResolverFactory.getListResolver(),
                buildInstances: this.buildInstanceResolverFactory.getListResolver(),
            },

            Mutation: {
                createProject: this.projectsResolverFactory.getCreateItemResolver(),
                createBuildDefinition: this.buildDefinitionResolverFactory.getCreateItemResolver(),
            },

            Project: {
                buildDefinitions: this.buildDefinitionResolverFactory.getListResolver(
                    (project: ProjectTypeInterface) => ({projectId: project.id}),
                ),
            },

            BuildDefinition: {
                project: this.projectsResolverFactory.getItemResolver(
                    (buildDefinitionType: BuildDefinitionTypeInterface) => buildDefinitionType.projectId,
                ),
                buildInstances: this.buildInstanceResolverFactory.getListResolver(
                    (buildDefinition: BuildDefinitionTypeInterface) => ({buildDefinitionId: buildDefinition.id}),
                ),
            },

            BuildInstance: {
                buildDefinition: this.buildDefinitionResolverFactory.getItemResolver(
                    (buildInstance: BuildInstanceTypeInterface) => buildInstance.buildDefinitionId,
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
