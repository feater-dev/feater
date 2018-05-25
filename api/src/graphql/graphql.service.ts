import {Component, HttpStatus, Inject} from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import * as GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';
import { ProjectInterface } from '../persistence/interface/project.interface';
import { ProjectRepository } from '../persistence/repository/project.repository';
import {FindAllProjectResponseDto} from '../api/dto/response/find-all-project-response.dto';
import {FindAllBuildDefinitionResponseDto} from '../api/dto/response/find-all-build-definition-response.dto';
import {BuildDefinitionRepository} from '../persistence/repository/build-definition.repository';
import {async} from 'rxjs/scheduler/async';

@Component()
export class GraphqlService {
    constructor(
        @Inject('TypeDefsProvider') private readonly typeDefsProvider,
        private readonly projectRepository: ProjectRepository,
        private readonly buildDefinitionRepository: BuildDefinitionRepository,
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
            },
            Project: {
                buildDefinitions: this.getProjectBuildDefinitionsResolver(),
            },
            BuildDefinition: {
                project: this.getBuildDefinitionProjectResolver(),
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

    public getBuildDefinitionProjectResolver(): (buildDefinition: FindAllBuildDefinitionResponseDto) => Promise<FindAllProjectResponseDto> {
        return async (buildDefinition: FindAllBuildDefinitionResponseDto): Promise<FindAllProjectResponseDto> => {
            const project = await this.projectRepository.findById(buildDefinition.projectId);

            return {
                _id: project._id,
                name: project.name,
            } as FindAllProjectResponseDto;
        };
    }

    public getProjectBuildDefinitionsResolver(): (project: FindAllProjectResponseDto) => Promise<FindAllBuildDefinitionResponseDto> {
        return async (project: FindAllProjectResponseDto): Promise<FindAllBuildDefinitionResponseDto> => {
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
}
