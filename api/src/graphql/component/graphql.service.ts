import {Component, Inject} from '@nestjs/common';
import {GraphQLSchema} from 'graphql';
import * as GraphQLJSON from 'graphql-type-json';
import {makeExecutableSchema} from 'graphql-tools';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {BuildDefinitionRepository} from '../../persistence/repository/build-definition.repository';
import {BuildInstanceRepository} from '../../persistence/repository/build-instance.repository';
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

        private readonly projectRepository: ProjectRepository,
        private readonly buildDefinitionRepository: BuildDefinitionRepository,
        private readonly buildInstanceRepository: BuildInstanceRepository,
    ) { }

    public get schema(): GraphQLSchema {
        return makeExecutableSchema({
            typeDefs: this.typeDefsProvider,
            resolvers: this.resolvers,
        });
    }

    public get resolvers(): any {
        return {
            JSON: GraphQLJSON,

            Query: {
                users: this.usersResolverFactory.createRootListResolver(),
                projects: this.projectsResolverFactory.createRootListResolver(),
                buildDefinitions: this.buildDefinitionResolverFactory.createRootListResolver(),
                buildInstances: this.buildInstanceResolverFactory.createRootListResolver(),
            },

            User: {},

            GithubProfile: {},
            GoogleProfile: {},

            Project: {
                buildDefinitions: this.getProjectBuildDefinitionsResolver(),
            },

            BuildDefinition: {
                project: this.projectsResolverFactory.createItemResolver(
                    (buildDefinitionType: BuildDefinitionTypeInterface) => {
                        return buildDefinitionType.projectId;
                    },
                ),
                buildInstances: this.getBuildDefinitionBuildInstancesResolver(),
            },

            BuildInstance: {
                buildDefinition: this.getBuildInstanceBuildDefinitionResolver(),
            },

            BuildDefinitionConfig: {},
            BuildDefinitionSource: {
                beforeBuildTasks: {
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
            },
            BuildDefinitionSourceReference: {},
            BuildDefinitionProxiedPort: {},
            BuildDefinitionSummaryItem: {},
            BuildDefinitionEnvironmentalVariable: {},
            BuildDefinitionComposeFile: {},
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
            CopyBeforeBuildTask: {},
            InterpolateBeforeBuildTask: {},
        };
    }

    public getProjectBuildDefinitionsResolver(): (project: ProjectTypeInterface) => Promise<Array<BuildDefinitionTypeInterface>> {
        return async (project: ProjectTypeInterface): Promise<Array<BuildDefinitionTypeInterface>> => {
            const buildDefinitions = await this.buildDefinitionRepository.find({projectId: project.id});
            const data: BuildDefinitionTypeInterface[] = [];

            for (const buildDefinition of buildDefinitions) {
                data.push({
                    id: buildDefinition._id,
                    name: buildDefinition.name,
                    projectId: buildDefinition.projectId,
                } as BuildDefinitionTypeInterface);
            }

            return data;
        };
    }

    public getBuildInstanceBuildDefinitionResolver(): (buildInstance: BuildInstanceTypeInterface) => Promise<BuildDefinitionTypeInterface> {
        return async (buildInstance: BuildInstanceTypeInterface): Promise<BuildDefinitionTypeInterface> => {
            const buildDefinition = await this.buildDefinitionRepository.findById(buildInstance.buildDefinitionId);

            return {
                id: buildDefinition._id,
                name: buildDefinition.name,
                projectId: buildDefinition.projectId,
            } as BuildDefinitionTypeInterface;
        };
    }

    public getBuildDefinitionBuildInstancesResolver(): (buildDefinition: BuildDefinitionTypeInterface) => Promise<Array<BuildInstanceTypeInterface>> {
        return async (buildDefinition: BuildDefinitionTypeInterface): Promise<Array<BuildInstanceTypeInterface>> => {
            const buildInstances = await this.buildInstanceRepository.find({buildDefinitionId: buildDefinition.id});
            const data: BuildInstanceTypeInterface[] = [];

            for (const buildInstance of buildInstances) {
                data.push({
                    id: buildInstance._id,
                    name: buildInstance.name,
                    buildDefinitionId: buildInstance.buildDefinitionId,
                } as BuildInstanceTypeInterface);
            }

            return data;
        };
    }
}
