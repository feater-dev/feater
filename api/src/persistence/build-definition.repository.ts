import { Component } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildDefinitionSchema } from './schema/build-definition.schema';
import { BuildDefinitionInterface } from './interface/build-definition.interface';
import { CreateBuildDefinitionRequestDto } from '../api/dto/request/create-build-definition-request.dto';

@Component()
export class BuildDefinitionRepository {

    constructor(
        @InjectModel(BuildDefinitionSchema) private readonly buildDefinitionModel: Model<BuildDefinitionInterface>,
    ) {}

    find(query: any): Promise<BuildDefinitionInterface[]> {
        return this.buildDefinitionModel.find(query).exec();
    }

    findById(id: string): Promise<BuildDefinitionInterface> {
        return this.buildDefinitionModel.findById(id).exec();
    }

    async findByIdOrFail(id: string): Promise<BuildDefinitionInterface> {
        const buildDefinition = await this.findById(id);
        if (null === buildDefinition) {
            throw new Error(`BuildDefinition document with id ${id} not found.`);
        }

        return buildDefinition;
    }

    create(createBuildDefinitionRequestDto: CreateBuildDefinitionRequestDto): Promise<BuildDefinitionInterface> {
        const createdBuildDefinition = new this.buildDefinitionModel(createBuildDefinitionRequestDto);

        return new Promise(resolve => {
            createdBuildDefinition.save();
            resolve(createdBuildDefinition);
        });
    }

}
