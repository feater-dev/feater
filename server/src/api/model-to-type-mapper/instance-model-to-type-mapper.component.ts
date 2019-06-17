import {Injectable} from '@nestjs/common';
import {InstanceInterface} from '../../persistence/interface/instance.interface';
import {InstanceTypeInterface} from '../type/instance-type.interface';
import {DateConverter} from '../date-converter.component';

@Injectable()
export class InstanceModelToTypeMapper {
    constructor(
        private readonly dateConverter: DateConverter,
    ) {}

    mapOne(instance: InstanceInterface): InstanceTypeInterface {
        return {
            id: instance._id,
            hash: instance.hash,
            name: instance.name,
            definitionId: instance.definitionId.toString(),
            services: instance.services,
            summaryItems: instance.summaryItems,
            envVariables: instance.envVariables,
            proxiedPorts: instance.proxiedPorts,
            createdAt: this.dateConverter.convertDate(instance.createdAt),
            updatedAt: this.dateConverter.convertDate(instance.updatedAt),
            completedAt: this.dateConverter.convertDate(instance.completedAt),
            failedAt: this.dateConverter.convertDate(instance.failedAt),
        } as InstanceTypeInterface;
    }

    mapMany(instances: InstanceInterface[]): InstanceTypeInterface[] {
        return instances.map(
            (instance: InstanceInterface): InstanceTypeInterface => {
                return this.mapOne(instance);
            },
        );
    }
}
