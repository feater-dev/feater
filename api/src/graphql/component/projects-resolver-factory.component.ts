import {Component} from '@nestjs/common';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {ProjectInterface} from '../../persistence/interface/project.interface';

@Component()
export class ProjectsResolverFactory {
    constructor(
        private readonly projectRepository: ProjectRepository,
    ) { }

    public createListResolver(queryExtractor: (any) => object): (object) => Promise<ProjectTypeInterface[]> {
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

    public createItemResolver(idExtractor: (any) => string): (string) => Promise<ProjectTypeInterface> {
        return async (object: any): Promise<ProjectTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.projectRepository.findById(idExtractor(object)),
            );
        };
    }

    protected mapPersistentModelToTypeModel(project: ProjectInterface): ProjectTypeInterface {
        return {
            id: project._id,
            name: project.name,
        } as ProjectTypeInterface;
    }
}
