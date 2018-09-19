import {Component} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {DefinitionSchema} from '../schema/definition.schema';
import {DefinitionInterface} from '../interface/definition.interface';
import {CreateDefinitionInputTypeInterface} from '../../graphql/input-type/create-definition-input-type.interface';
import {SourceTypeInterface} from '../../graphql/type/nested/definition-config/source-type.interface';
import {DeployKeyRepository} from './deploy-key.repository';
import * as gitUrlParse from 'git-url-parse';

@Component()
export class DefinitionRepository {

    constructor(
        @InjectModel(DefinitionSchema) private readonly definitionModel: Model<DefinitionInterface>,
        private readonly deployKeyRepository: DeployKeyRepository,
    ) {}

    find(criteria: object, offset: number, limit: number, sort?: object): Promise<DefinitionInterface[]> {
        const query = this.definitionModel.find(criteria);
        query
            .skip(offset)
            .limit(limit);
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

    async create(createDefinitionInputType: CreateDefinitionInputTypeInterface): Promise<DefinitionInterface> {
        const createdDefinition = new this.definitionModel(createDefinitionInputType);
        await createdDefinition.save();

        for (const source of createdDefinition.config.sources) {
            const {owner: repositoryOwner, name: repositoryName} = gitUrlParse((source as SourceTypeInterface).sshCloneUrl);
            const deployKeyExists = await this.deployKeyRepository.existsForRepositoryOwnerAndName(repositoryOwner, repositoryName);
            if (!deployKeyExists) {
                await this.deployKeyRepository.create(repositoryOwner, repositoryName);
            }
        }

        return createdDefinition;
    }
}
