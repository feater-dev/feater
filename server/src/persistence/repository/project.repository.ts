import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectInterface } from '../interface/project.interface';
import { CreateProjectInputTypeInterface } from '../../api/input-type/create-project-input-type.interface';

@Injectable()
export class ProjectRepository {
    constructor(
        @InjectModel('Project')
        private readonly projectModel: Model<ProjectInterface>,
    ) {}

    find(
        criteria: any,
        offset: number,
        limit: number,
        sort?: any,
    ): Promise<ProjectInterface[]> {
        const query = this.projectModel.find(criteria);
        query.skip(offset).limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    findById(id: string): Promise<ProjectInterface> {
        return this.projectModel.findById(id).exec();
    }

    async findByIdOrFail(id: string): Promise<ProjectInterface> {
        const project = await this.findById(id);
        if (null === project) {
            throw new Error(`Project document with id ${id} not found.`);
        }

        return project;
    }

    create(
        createProjectInputType: CreateProjectInputTypeInterface,
    ): Promise<ProjectInterface> {
        const createdProject = new this.projectModel(createProjectInputType);
        createdProject.createdAt = new Date();
        createdProject.updatedAt = new Date();

        return new Promise(resolve => {
            createdProject.save();
            resolve(createdProject);
        });
    }
}
