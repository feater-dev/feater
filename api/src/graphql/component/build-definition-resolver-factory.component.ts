import {Component} from '@nestjs/common';
import {BuildDefinitionTypeInterface} from '../type/build-definition-type.interface';
import {BuildDefinitionRepository} from '../../persistence/repository/build-definition.repository';
import {BuildDefinitionConfigMapper} from './build-definition-config-mapper.component';
import {BuildDefinitionInterface} from '../../persistence/interface/build-definition.interface';

@Component()
export class BuildDefinitionResolverFactory {
    constructor(
        private readonly buildDefinitionRepository: BuildDefinitionRepository,
        private readonly buildDefinitionConfigMapper: BuildDefinitionConfigMapper,
    ) { }

    public createListResolver(queryExtractor: (any) => object): (object) => Promise<BuildDefinitionTypeInterface[]> {
        return async (object: any): Promise<BuildDefinitionTypeInterface[]> => {
            const buildDefinitions = await this.buildDefinitionRepository.find(
                queryExtractor ? queryExtractor(object) : {},
            );
            const data: BuildDefinitionTypeInterface[] = [];

            for (const buildDefinition of buildDefinitions) {
                data.push(this.mapPersistentModelToTypeModel(buildDefinition));
            }

            return data;
        };
    }

    public createItemResolver(idExtractor: (any) => string): (string) => Promise<BuildDefinitionTypeInterface> {
        return async (object: any): Promise<BuildDefinitionTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.buildDefinitionRepository.findById(idExtractor(object)),
            );
        };
    }

    protected mapPersistentModelToTypeModel(buildDefinition: BuildDefinitionInterface): BuildDefinitionTypeInterface {
        return {
            id: buildDefinition._id,
            name: buildDefinition.name,
            projectId: buildDefinition.projectId,
            config: this.buildDefinitionConfigMapper.map(buildDefinition.config),
        } as BuildDefinitionTypeInterface;
    }
}
