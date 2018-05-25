import {Component, HttpStatus, Inject} from '@nestjs/common';
import {GraphQLSchema} from 'graphql';
import * as GraphQLJSON from 'graphql-type-json';
import {makeExecutableSchema} from 'graphql-tools';
import {ProjectRepository} from '../persistence/repository/project.repository';
import {BuildDefinitionRepository} from '../persistence/repository/build-definition.repository';
import {BuildInstanceRepository} from '../persistence/repository/build-instance.repository';
import {ProjectTypeInterface} from './interfaces/project-type.interface';
import {BuildDefinitionTypeInterface} from './interfaces/build-definition-type.interface';
import {BuildInstanceTypeInterface} from './interfaces/build-instance-type.interface';

@Component()
export class GraphqlService {
    constructor(
        @Inject('TypeDefsProvider') private readonly typeDefsProvider,
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
                hello: this.hello,
                projects: this.projects,
                buildDefinitions: this.buildDefinitions,
                buildInstances: this.buildInstances,
            },
            Project: {
                buildDefinitions: this.getProjectBuildDefinitionsResolver(),
            },
            BuildDefinition: {
                project: this.getBuildDefinitionProjectResolver(),
                buildInstances: this.getBuildDefinitionBuildInstancesResolver(),
            },
            BuildInstance: {
                buildDefinition: this.getBuildInstanceBuildDefinitionResolver(),
            },
        };
    }

    public get hello(): () => Promise<string> {
        return async (): Promise<string> => {
            return 'World!';
        };
    }

    public get projects(): () => Promise<Array<ProjectTypeInterface>> {
        return async (): Promise<Array<ProjectTypeInterface>> => {
            const projects = await this.projectRepository.find({});
            const data: ProjectTypeInterface[] = [];

            for (const project of projects) {
                data.push({
                    id: project._id,
                    name: project.name,
                } as ProjectTypeInterface);
            }

            return data;
        };
    }

    public get buildDefinitions(): () => Promise<Array<BuildDefinitionTypeInterface>> {
        return async (): Promise<Array<BuildDefinitionTypeInterface>> => {
            const buildDefinitions = await this.buildDefinitionRepository.find({});
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

    public get buildInstances(): () => Promise<Array<BuildInstanceTypeInterface>> {
        return async (): Promise<Array<BuildInstanceTypeInterface>> => {
            const buildInstances = await this.buildInstanceRepository.find({});
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

    public getBuildDefinitionProjectResolver(): (buildDefinition: BuildDefinitionTypeInterface) => Promise<ProjectTypeInterface> {
        return async (buildDefinition: BuildDefinitionTypeInterface): Promise<ProjectTypeInterface> => {
            const project = await this.projectRepository.findById(buildDefinition.projectId);

            return {
                id: project._id,
                name: project.name,
            } as ProjectTypeInterface;
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
