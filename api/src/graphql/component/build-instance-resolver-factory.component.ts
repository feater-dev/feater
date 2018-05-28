import {Component} from '@nestjs/common';
import {BuildInstanceTypeInterface} from '../type/build-instance-type.interface';
import {BuildInstanceRepository} from '../../persistence/repository/build-instance.repository';
import {BuildInstanceInterface} from '../../persistence/interface/build-instance.interface';

@Component()
export class BuildInstanceResolverFactory {
    constructor(
        private readonly buildInstanceRepository: BuildInstanceRepository,
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

    public createItemResolver(idExtractor: (any) => string): (string) => Promise<BuildInstanceTypeInterface> {
        return async (object: any): Promise<BuildInstanceTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.buildInstanceRepository.findById(idExtractor(object)),
            );
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
