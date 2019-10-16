import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DefinitionInterface } from '../interface/definition.interface';

@Injectable()
export class DefinitionRepository {
    constructor(
        @InjectModel('Definition')
        private readonly definitionModel: Model<DefinitionInterface>,
    ) {}

    find(
        criteria: any,
        offset: number,
        limit: number,
        sort?: any,
    ): Promise<DefinitionInterface[]> {
        const query = this.definitionModel.find(criteria);
        query.skip(offset).limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    findById(id: string): Promise<DefinitionInterface> {
        return this.definitionModel.findById(id).exec();
    }

    async findByIdOrFail(id: string): Promise<DefinitionInterface> {
        const definition = await this.findById(id);
        if (null === definition) {
            throw new Error(`Definition document with id ${id} not found.`);
        }

        return definition;
    }

    async create(
        projectId: string,
        name: string,
        recipeAsYaml: string,
    ): Promise<DefinitionInterface> {
        const createdDefinition = new this.definitionModel({
            projectId,
            name,
        });
        createdDefinition.recipeAsYaml = recipeAsYaml;
        createdDefinition.createdAt = new Date();
        createdDefinition.updatedAt = new Date();
        await createdDefinition.save();

        return createdDefinition;
    }

    async update(
        id: string,
        name: string,
        recipeAsYaml: string,
    ): Promise<DefinitionInterface> {
        const updatedDefinition = await this.findById(id);
        if (null === updatedDefinition) {
            throw new Error(`Definition document with id ${id} not found.`);
        }
        updatedDefinition.name = name;
        updatedDefinition.recipeAsYaml = recipeAsYaml;
        updatedDefinition.updatedAt = new Date();
        await updatedDefinition.save();

        return updatedDefinition;
    }

    async remove(id: string): Promise<boolean> {
        const removal = await this.definitionModel.findByIdAndRemove(id);

        return true;
    }
}
