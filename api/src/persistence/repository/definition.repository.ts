import {Component} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {DefinitionSchema} from '../schema/definition.schema';
import {DefinitionInterface} from '../interface/definition.interface';
import {CreateDefinitionRequestDto} from '../../api/dto/request/create-definition-request.dto';
import {CreateDefinitionInputTypeInterface} from '../../graphql/input-type/create-definition-input-type.interface';

@Component()
export class DefinitionRepository {

    constructor(
        @InjectModel(DefinitionSchema) private readonly definitionModel: Model<DefinitionInterface>,
    ) {}

    find(query: any): Promise<DefinitionInterface[]> {
        return this.definitionModel.find(query).exec();
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

    create(createDefinitionInputType: CreateDefinitionInputTypeInterface): Promise<DefinitionInterface> {
        const createdDefinition = new this.definitionModel(createDefinitionInputType);
        return new Promise(resolve => {
            createdDefinition.save();
            resolve(createdDefinition);
        });
    }
}
