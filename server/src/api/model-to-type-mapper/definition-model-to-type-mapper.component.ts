import {Injectable} from '@nestjs/common';
import {DefinitionInterface} from '../../persistence/interface/definition.interface';
import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {DefinitionConfigMapper} from './definition-config-mapper.component';
import {DateConverter} from '../date-converter.component';

@Injectable()
export class DefinitionModelToTypeMapper {
    constructor(
        private readonly definitionConfigMapper: DefinitionConfigMapper,
        private readonly dateConverter: DateConverter,
    ) { }

    mapOne(definition: DefinitionInterface): DefinitionTypeInterface {
        return {
            id: definition._id,
            name: definition.name,
            projectId: definition.projectId.toString(),
            config: this.definitionConfigMapper.map(definition.config),
            createdAt: this.dateConverter.convertDate(definition.createdAt),
            updatedAt: this.dateConverter.convertDate(definition.updatedAt),
        } as DefinitionTypeInterface;
    }

    mapMany(definitions: DefinitionInterface[]): DefinitionTypeInterface[] {
        return definitions.map(
            (definition: DefinitionInterface) => {
                return this.mapOne(definition);
            },
        );
    }
}
