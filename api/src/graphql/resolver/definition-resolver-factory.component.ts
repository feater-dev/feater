import {Component} from '@nestjs/common';
import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {DefinitionRepository} from '../../persistence/repository/definition.repository';
import {DefinitionConfigMapper} from './definition-config-mapper.component';
import {DefinitionInterface} from '../../persistence/interface/definition.interface';
import {CreateDefinitionInputTypeInterface} from '../input-type/create-definition-input-type.interface';
import {CreateDefinitionRequestDto} from '../../api/dto/request/create-definition-request.dto';

@Component()
export class DefinitionResolverFactory {
    constructor(
        private readonly definitionRepository: DefinitionRepository,
        private readonly definitionConfigMapper: DefinitionConfigMapper,
    ) { }

    public getListResolver(queryExtractor?: (any) => object): (object) => Promise<DefinitionTypeInterface[]> {
        return async (object: any): Promise<DefinitionTypeInterface[]> => {
            const definitions = await this.definitionRepository.find(
                queryExtractor ? queryExtractor(object) : {},
            );
            const data: DefinitionTypeInterface[] = [];

            for (const definition of definitions) {
                data.push(this.mapPersistentModelToTypeModel(definition));
            }

            return data;
        };
    }

    public getItemResolver(idExtractor: (any) => string): (string) => Promise<DefinitionTypeInterface> {
        return async (object: any): Promise<DefinitionTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.definitionRepository.findById(idExtractor(object)),
            );
        };
    }

    public getCreateItemResolver(): (_: any, createDefinitionInput: CreateDefinitionInputTypeInterface) => Promise<DefinitionTypeInterface> {
        return async (_: any, createDefinitionInput: CreateDefinitionInputTypeInterface): Promise<DefinitionTypeInterface> => {
            // TODO Add validation.
            const definition = await this.definitionRepository.create(createDefinitionInput as CreateDefinitionRequestDto);

            return this.mapPersistentModelToTypeModel(definition);
        };
    }

    protected mapPersistentModelToTypeModel(definition: DefinitionInterface): DefinitionTypeInterface {
        return {
            id: definition._id,
            name: definition.name,
            projectId: definition.projectId,
            config: this.definitionConfigMapper.map(definition.config),
        } as DefinitionTypeInterface;
    }
}
