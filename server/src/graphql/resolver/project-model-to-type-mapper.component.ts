import {Injectable} from '@nestjs/common';
import {ProjectInterface} from '../../persistence/interface/project.interface';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {DateConverter} from './date-resolver.component';

@Injectable()
export class ProjectModelToTypeMapper {
    constructor(
        private readonly dateConverter: DateConverter,
    ) {}

    public mapOne(project: ProjectInterface): ProjectTypeInterface {
        return {
            id: project._id,
            name: project.name,
            createdAt: this.dateConverter.getISODate(project.createdAt),
            updatedAt: this.dateConverter.getISODate(project.updatedAt),
        } as ProjectTypeInterface;
    }

    public mapMany(projects: ProjectInterface[]): ProjectTypeInterface[] {
        return projects.map(
            (project: ProjectInterface): ProjectTypeInterface => {
                return this.mapOne(project);
            },
        );
    }
}
