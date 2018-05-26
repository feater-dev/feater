import {Component} from '@nestjs/common';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {ProjectInterface} from '../../persistence/interface/project.interface';

@Component()
export class ProjectsResolverFactory {
    constructor(
        private readonly projectRepository: ProjectRepository,
    ) { }

    public createRootListResolver(): () => Promise<Array<ProjectTypeInterface>> {
        return async (): Promise<Array<ProjectTypeInterface>> => {
            const projects = await this.projectRepository.find({});

            return projects.map(
                (project: ProjectInterface): ProjectTypeInterface => {
                    return this.mapPersistentModelToTypeModel(project);
                },
            );
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
