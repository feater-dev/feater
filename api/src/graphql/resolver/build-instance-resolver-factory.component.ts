import {Component} from '@nestjs/common';
import {BuildInstanceTypeInterface} from '../type/build-instance-type.interface';
import {BuildInstanceRepository} from '../../persistence/repository/build-instance.repository';
import {BuildInstanceInterface} from '../../persistence/interface/build-instance.interface';
import {CreateBuildDefinitionInputTypeInterface} from '../input-type/create-build-definition-input-type.interface';
import {CreateBuildDefinitionRequestDto} from '../../api/dto/request/create-build-definition-request.dto';
import {BuildDefinitionTypeInterface} from '../type/build-definition-type.interface';
import {CreateBuildInstanceInputTypeInterface} from '../input-type/create-build-instance-input-type.interface';
import {CreateBuildInstanceRequestDto} from '../../api/dto/request/create-build-instance-request.dto';
import {RemoveBuildInstanceInputTypeInterface} from '../input-type/remove-build-instance-input-type.interface';
import {Instantiator} from '../../instantiation/instantiator.component';
import * as nanoidGenerate from 'nanoid/generate';
import {BuildDefinitionRepository} from '../../persistence/repository/build-definition.repository';

@Component()
export class BuildInstanceResolverFactory {
    constructor(
        private readonly buildInstanceRepository: BuildInstanceRepository,
        private readonly buildDefinitionRepository: BuildDefinitionRepository,
        private readonly instantiator: Instantiator,
    ) { }

    public getListResolver(queryExtractor?: (any) => object): (object) => Promise<BuildInstanceTypeInterface[]> {
        return async (object: any): Promise<BuildInstanceTypeInterface[]> => {
            const buildInstances = await this.buildInstanceRepository.find(
                queryExtractor ? queryExtractor(object) : {},
            );
            const data: BuildInstanceTypeInterface[] = [];

            for (const buildInstance of buildInstances) {
                data.push(this.mapPersistentModelToTypeModel(buildInstance));
            }

            return data;
        };
    }

    public getItemResolver(idExtractor: (any) => string): (string) => Promise<BuildInstanceTypeInterface> {
        return async (object: any): Promise<BuildInstanceTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.buildInstanceRepository.findById(idExtractor(object)),
            );
        };
    }

    public getCreateItemResolver(): (_: any, createBuildInstanceInput: CreateBuildInstanceInputTypeInterface) => Promise<BuildInstanceTypeInterface> {
        return async (_: any, createBuildInstanceInput: CreateBuildInstanceInputTypeInterface): Promise<BuildInstanceTypeInterface> => {
            // TODO Add validation.
            const buildInstance = await this.buildInstanceRepository.create(createBuildInstanceInput as CreateBuildInstanceRequestDto);
            const buildDefinition = await this.buildDefinitionRepository.findByIdOrFail(buildInstance.buildDefinitionId);
            const hash = nanoidGenerate('0123456789abcdefghijklmnopqrstuvwxyz', 8);

            process.nextTick(() => {
                const build = this.instantiator.createBuild(
                    buildInstance._id,
                    hash,
                    buildDefinition,
                );
                this.instantiator.instantiateBuild(build);
            });

            return this.mapPersistentModelToTypeModel(buildInstance);
        };
    }

    public getRemoveItemResolver(): (_: any, removeBuildInstanceInput: RemoveBuildInstanceInputTypeInterface) => Promise<boolean> {
        return async (_: any, removeBuildInstanceInput: RemoveBuildInstanceInputTypeInterface): Promise<boolean> => {
            return await this.buildInstanceRepository.remove(removeBuildInstanceInput.id);
        };
    }

    protected mapPersistentModelToTypeModel(buildInstance: BuildInstanceInterface): BuildInstanceTypeInterface {
        return {
            id: buildInstance._id,
            name: buildInstance.name,
            buildDefinitionId: buildInstance.buildDefinitionId,
        } as BuildInstanceTypeInterface;
    }
}
