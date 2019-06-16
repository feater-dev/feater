import {Injectable} from '@nestjs/common';
import {DefinitionInterface} from '../../persistence/interface/definition.interface';
import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {DefinitionConfigMapper} from './definition-config-mapper.component';

@Injectable()
export class DefinitionModelToTypeMapper {
    constructor(
        private readonly definitionConfigMapper: DefinitionConfigMapper,
    ) { }

    public mapOne(definition: DefinitionInterface): DefinitionTypeInterface {
        return {
            id: definition._id,
            name: definition.name,
            projectId: definition.projectId.toString(),
            config: this.definitionConfigMapper.map(definition.config),
            createdAt: definition.createdAt,
            updatedAt: definition.updatedAt,
        } as DefinitionTypeInterface;
    }

    public mapMany(definitions: DefinitionInterface[]): DefinitionTypeInterface[] {
        return definitions.map(
            (definition: DefinitionInterface) => {
                return this.mapOne(definition);
            },
        );
    }
}
