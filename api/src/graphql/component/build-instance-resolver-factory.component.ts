import {Component} from '@nestjs/common';
import {BuildInstanceTypeInterface} from '../type/build-instance-type.interface';
import {BuildInstanceRepository} from '../../persistence/repository/build-instance.repository';

@Component()
export class BuildInstanceResolverFactory {
    constructor(
        private readonly buildInstanceRepository: BuildInstanceRepository,
    ) { }

    public createRootListResolver(): () => Promise<Array<BuildInstanceTypeInterface>> {
        return async (): Promise<Array<BuildInstanceTypeInterface>> => {
            const buildInstances = await this.buildInstanceRepository.find({});
            const data: BuildInstanceTypeInterface[] = [];

            for (const buildInstance of buildInstances) {
                data.push({
                    id: buildInstance._id,
                    name: buildInstance.name,
                    buildDefinitionId: buildInstance.buildDefinitionId,
                } as BuildInstanceTypeInterface);
            }

            return data;
        };
    }
}
