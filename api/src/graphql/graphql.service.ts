import {Component, HttpStatus, Inject} from '@nestjs/common';
import {GraphQLSchema} from 'graphql';
import * as GraphQLJSON from 'graphql-type-json';
import {makeExecutableSchema} from 'graphql-tools';
import {ProjectRepository} from '../persistence/repository/project.repository';
import {BuildDefinitionRepository} from '../persistence/repository/build-definition.repository';
import {BuildInstanceRepository} from '../persistence/repository/build-instance.repository';
import {FindAllProjectResponseDto} from '../api/dto/response/find-all-project-response.dto';
import {FindAllBuildDefinitionResponseDto} from '../api/dto/response/find-all-build-definition-response.dto';
import {FindAllBuildInstanceResponseDto} from '../api/dto/response/find-all-build-instance-response.dto';

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

    public get projects(): () => Promise<Array<FindAllProjectResponseDto>> {
        return async (): Promise<Array<FindAllProjectResponseDto>> => {
            const projects = await this.projectRepository.find({});
            const data: FindAllProjectResponseDto[] = [];

            for (const project of projects) {
                data.push({
                    _id: project._id,
                    name: project.name,
                } as FindAllProjectResponseDto);
            }

            return data;
        };
    }

    public get buildDefinitions(): () => Promise<Array<FindAllBuildDefinitionResponseDto>> {
        return async (): Promise<Array<FindAllBuildDefinitionResponseDto>> => {
            const buildDefinitions = await this.buildDefinitionRepository.find({});
            const data: FindAllBuildDefinitionResponseDto[] = [];

            for (const buildDefinition of buildDefinitions) {
                data.push({
                    _id: buildDefinition._id,
                    name: buildDefinition.name,
                    projectId: buildDefinition.projectId,
                } as FindAllBuildDefinitionResponseDto);
            }

            return data;
        };
    }

    public get buildInstances(): () => Promise<Array<FindAllBuildInstanceResponseDto>> {
        return async (): Promise<Array<FindAllBuildInstanceResponseDto>> => {
            const buildInstances = await this.buildInstanceRepository.find({});
            const data: FindAllBuildInstanceResponseDto[] = [];

            for (const buildInstance of buildInstances) {
                data.push({
                    _id: buildInstance._id,
                    name: buildInstance.name,
                    buildDefinitionId: buildInstance.buildDefinitionId,
                } as FindAllBuildInstanceResponseDto);
            }

            return data;
        };
    }

    public getBuildDefinitionProjectResolver(): (buildDefinition: FindAllBuildDefinitionResponseDto) => Promise<FindAllProjectResponseDto> {
        return async (buildDefinition: FindAllBuildDefinitionResponseDto): Promise<FindAllProjectResponseDto> => {
            const project = await this.projectRepository.findById(buildDefinition.projectId);

            return {
                _id: project._id,
                name: project.name,
            } as FindAllProjectResponseDto;
        };
    }

    public getProjectBuildDefinitionsResolver(): (project: FindAllProjectResponseDto) => Promise<Array<FindAllBuildDefinitionResponseDto>> {
        return async (project: FindAllProjectResponseDto): Promise<Array<FindAllBuildDefinitionResponseDto>> => {
            const buildDefinitions = await this.buildDefinitionRepository.find({projectId: project._id});
            const data: FindAllBuildDefinitionResponseDto[] = [];

            for (const buildDefinition of buildDefinitions) {
                data.push({
                    _id: buildDefinition._id,
                    name: buildDefinition.name,
                    projectId: buildDefinition.projectId,
                } as FindAllBuildDefinitionResponseDto);
            }

            return data;
        };
    }

    public getBuildInstanceBuildDefinitionResolver(): (buildInstance: FindAllBuildInstanceResponseDto) => Promise<FindAllBuildDefinitionResponseDto> {
        return async (buildInstance: FindAllBuildInstanceResponseDto): Promise<FindAllBuildDefinitionResponseDto> => {
            const buildDefinition = await this.buildDefinitionRepository.findById(buildInstance.buildDefinitionId);

            return {
                _id: buildDefinition._id,
                name: buildDefinition.name,
                projectId: buildDefinition.projectId,
            } as FindAllBuildDefinitionResponseDto;
        };
    }

    public getBuildDefinitionBuildInstancesResolver(): (buildDefinition: FindAllBuildDefinitionResponseDto) => Promise<Array<FindAllBuildInstanceResponseDto>> {
        return async (buildDefinition: FindAllBuildDefinitionResponseDto): Promise<Array<FindAllBuildInstanceResponseDto>> => {
            const buildInstances = await this.buildInstanceRepository.find({buildDefinitionId: buildDefinition._id});
            const data: FindAllBuildInstanceResponseDto[] = [];

            for (const buildInstance of buildInstances) {
                data.push({
                    _id: buildInstance._id,
                    name: buildInstance.name,
                    buildDefinitionId: buildInstance.buildDefinitionId,
                } as FindAllBuildInstanceResponseDto);
            }

            return data;
        };
    }
}
