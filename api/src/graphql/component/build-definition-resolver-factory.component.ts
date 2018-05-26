import {Component} from '@nestjs/common';
import {BuildDefinitionTypeInterface} from '../type/build-definition-type.interface';
import {BuildDefinitionRepository} from '../../persistence/repository/build-definition.repository';
import {BuildDefinitionConfigMapper} from './build-definition-config-mapper.component';

@Component()
export class BuildDefinitionResolverFactory {
    constructor(
        private readonly buildDefinitionRepository: BuildDefinitionRepository,
        private readonly buildDefinitionConfigMapper: BuildDefinitionConfigMapper,
    ) { }

    public createResolver(): () => Promise<Array<BuildDefinitionTypeInterface>> {
        return async (): Promise<Array<BuildDefinitionTypeInterface>> => {
            const buildDefinitions = await this.buildDefinitionRepository.find({});
            const data: BuildDefinitionTypeInterface[] = [];

            for (const buildDefinition of buildDefinitions) {
                data.push({
                    id: buildDefinition._id,
                    name: buildDefinition.name,
                    projectId: buildDefinition.projectId,
                    config: this.buildDefinitionConfigMapper.map(buildDefinition.config),
                } as BuildDefinitionTypeInterface);
            }

            return data;
        };
    }
}
