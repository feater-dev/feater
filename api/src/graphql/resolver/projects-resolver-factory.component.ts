import {Component} from '@nestjs/common';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {ProjectInterface} from '../../persistence/interface/project.interface';
import {CreateProjectInputTypeInterface} from '../input-type/create-project-input-type.interface';
import {CreateProjectRequestDto} from '../../api/dto/request/create-project-request.dto';

@Component()
export class ProjectsResolverFactory {
    constructor(
        private readonly projectRepository: ProjectRepository,
    ) { }

    public getListResolver(queryExtractor?: (any) => object): (object) => Promise<ProjectTypeInterface[]> {
        return async (object: any): Promise<ProjectTypeInterface[]> => {
            const projects = await this.projectRepository.find(
                queryExtractor ? queryExtractor(object) : {},
            );
            const data: ProjectTypeInterface[] = [];

            for (const project of projects) {
                data.push(this.mapPersistentModelToTypeModel(project));
            }

            return data;
        };
    }

    public getItemResolver(idExtractor: (any) => string): (string) => Promise<ProjectTypeInterface> {
        return async (object: any): Promise<ProjectTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.projectRepository.findById(idExtractor(object)),
            );
        };
    }

    public getCreateItemResolver(): (_: any, createProjectInput: CreateProjectInputTypeInterface) => Promise<ProjectTypeInterface> {
        return async (_: any, createProjectInput: CreateProjectInputTypeInterface): Promise<ProjectTypeInterface> => {
            // TODO Add validation.
            const project = await this.projectRepository.create(createProjectInput as CreateProjectRequestDto);

            return this.mapPersistentModelToTypeModel(project);
        };
    }

    protected mapPersistentModelToTypeModel(project: ProjectInterface): ProjectTypeInterface {
        return {
            id: project._id,
            name: project.name,
        } as ProjectTypeInterface;
    }
}
