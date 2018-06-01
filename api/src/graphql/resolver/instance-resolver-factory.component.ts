import {Component} from '@nestjs/common';
import {InstanceTypeInterface} from '../type/instance-type.interface';
import {InstanceRepository} from '../../persistence/repository/instance.repository';
import {InstanceInterface} from '../../persistence/interface/instance.interface';
import {CreateDefinitionInputTypeInterface} from '../input-type/create-definition-input-type.interface';
import {CreateDefinitionRequestDto} from '../../api/dto/request/create-definition-request.dto';
import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {CreateInstanceInputTypeInterface} from '../input-type/create-instance-input-type.interface';
import {CreateInstanceRequestDto} from '../../api/dto/request/create-instance-request.dto';
import {RemoveInstanceInputTypeInterface} from '../input-type/remove-instance-input-type.interface';
import {Instantiator} from '../../instantiation/instantiator.component';
import * as nanoidGenerate from 'nanoid/generate';
import {DefinitionRepository} from '../../persistence/repository/definition.repository';

@Component()
export class InstanceResolverFactory {
    constructor(
        private readonly instanceRepository: InstanceRepository,
        private readonly definitionRepository: DefinitionRepository,
        private readonly instantiator: Instantiator,
    ) { }

    public getListResolver(queryExtractor?: (any) => object): (object) => Promise<InstanceTypeInterface[]> {
        return async (object: any): Promise<InstanceTypeInterface[]> => {
            const instances = await this.instanceRepository.find(
                queryExtractor ? queryExtractor(object) : {},
            );
            const data: InstanceTypeInterface[] = [];

            for (const instance of instances) {
                data.push(this.mapPersistentModelToTypeModel(instance));
            }

            return data;
        };
    }

    public getItemResolver(idExtractor: (any) => string): (string) => Promise<InstanceTypeInterface> {
        return async (object: any): Promise<InstanceTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.instanceRepository.findById(idExtractor(object)),
            );
        };
    }

    public getCreateItemResolver(): (_: any, createInstanceInput: CreateInstanceInputTypeInterface) => Promise<InstanceTypeInterface> {
        return async (_: any, createInstanceInput: CreateInstanceInputTypeInterface): Promise<InstanceTypeInterface> => {
            // TODO Add validation.
            const instance = await this.instanceRepository.create(createInstanceInput as CreateInstanceRequestDto);
            const definition = await this.definitionRepository.findByIdOrFail(instance.definitionId);
            const hash = nanoidGenerate('0123456789abcdefghijklmnopqrstuvwxyz', 8);

            process.nextTick(() => {
                const build = this.instantiator.createBuild(
                    instance._id,
                    hash,
                    definition,
                );
                this.instantiator.instantiateBuild(build);
            });

            return this.mapPersistentModelToTypeModel(instance);
        };
    }

    public getRemoveItemResolver(): (_: any, removeInstanceInput: RemoveInstanceInputTypeInterface) => Promise<boolean> {
        return async (_: any, removeInstanceInput: RemoveInstanceInputTypeInterface): Promise<boolean> => {
            return await this.instanceRepository.remove(removeInstanceInput.id);
        };
    }

    protected mapPersistentModelToTypeModel(instance: InstanceInterface): InstanceTypeInterface {
        return {
            id: instance._id,
            name: instance.name,
            definitionId: instance.definitionId,
        } as InstanceTypeInterface;
    }
}
