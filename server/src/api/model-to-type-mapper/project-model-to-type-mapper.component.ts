import { Injectable } from '@nestjs/common';
import { ProjectInterface } from '../../persistence/interface/project.interface';
import { ProjectTypeInterface } from '../type/project-type.interface';
import { DateConverter } from '../date-converter.component';

@Injectable()
export class ProjectModelToTypeMapper {
    constructor(private readonly dateConverter: DateConverter) {}

    mapOne(project: ProjectInterface): ProjectTypeInterface {
        return {
            id: project._id,
            name: project.name,
            createdAt: this.dateConverter.convertDate(project.createdAt),
            updatedAt: this.dateConverter.convertDate(project.updatedAt),
        } as ProjectTypeInterface;
    }

    mapMany(projects: ProjectInterface[]): ProjectTypeInterface[] {
        return projects.map(
            (project: ProjectInterface): ProjectTypeInterface => {
                return this.mapOne(project);
            },
        );
    }
}
