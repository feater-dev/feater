import {Component} from '@nestjs/common';
import {BuildDefinitionTypeInterface} from '../type/build-definition-type.interface';
import {BuildDefinitionRepository} from '../../persistence/repository/build-definition.repository';
import {BuildDefinitionConfigMapper} from './build-definition-config-mapper.component';
import {BuildDefinitionInterface} from '../../persistence/interface/build-definition.interface';
import {CreateBuildDefinitionInputTypeInterface} from '../type/create-build-definition-input-type.interface';
import {CreateBuildDefinitionRequestDto} from '../../api/dto/request/create-build-definition-request.dto';

@Component()
export class BuildDefinitionResolverFactory {
    constructor(
        private readonly buildDefinitionRepository: BuildDefinitionRepository,
        private readonly buildDefinitionConfigMapper: BuildDefinitionConfigMapper,
    ) { }

    public getListResolver(queryExtractor?: (any) => object): (object) => Promise<BuildDefinitionTypeInterface[]> {
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

    public getItemResolver(idExtractor: (any) => string): (string) => Promise<BuildDefinitionTypeInterface> {
        return async (object: any): Promise<BuildDefinitionTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.buildDefinitionRepository.findById(idExtractor(object)),
            );
        };
    }

    public getCreateItemResolver(): (_: any, createBuildDefinitionInput: CreateBuildDefinitionInputTypeInterface) => Promise<BuildDefinitionTypeInterface> {
        return async (_: any, createBuildDefinitionInput: CreateBuildDefinitionInputTypeInterface): Promise<BuildDefinitionTypeInterface> => {
            // TODO Add validation.
            const buildDefinition = await this.buildDefinitionRepository.create(createBuildDefinitionInput as CreateBuildDefinitionRequestDto);

            return this.mapPersistentModelToTypeModel(buildDefinition);
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
