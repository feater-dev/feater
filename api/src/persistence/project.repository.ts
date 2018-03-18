import { Model } from 'mongoose';
import { Component } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectSchema } from './schema/project.schema';
import { ProjectInterface } from './interface/project.interface';
import { CreateProjectRequestDto } from '../api/dto/request/create-project-request.dto';

@Component()
export class ProjectRepository {

    constructor(
        @InjectModel(ProjectSchema) private readonly projectModel: Model<ProjectInterface>,
    ) {}

    find(query: any): Promise<ProjectInterface[]> {
        return this.projectModel.find(query).exec();
    }

    findById(id): Promise<ProjectInterface> {
        return this.projectModel.findById(id).exec();
    }

    async findByIdOrFail(id): Promise<ProjectInterface> {
        const project = await this.findById(id);
        if (null === project) {
            throw new Error(`Project document with id ${id} not found.`);
        }

        return project;
    }

    create(createProjectDto: CreateProjectRequestDto): Promise<ProjectInterface> {
        const createdProject = new this.projectModel(createProjectDto);

        return new Promise(resolve => {
            createdProject.save();
            resolve(createdProject);
        });
    }

}
