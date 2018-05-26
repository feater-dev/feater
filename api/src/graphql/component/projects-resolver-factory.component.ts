import {Component} from '@nestjs/common';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {ProjectTypeInterface} from '../type/project-type.interface';

@Component()
export class ProjectsResolverFactory {
    constructor(
        private readonly projectRepository: ProjectRepository,
    ) { }

    public createResolver(): () => Promise<Array<ProjectTypeInterface>> {
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
}
