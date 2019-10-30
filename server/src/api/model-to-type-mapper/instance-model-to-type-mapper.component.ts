import { Injectable } from '@nestjs/common';
import { InstanceInterface } from '../../persistence/interface/instance.interface';
import { InstanceTypeInterface } from '../type/instance-type.interface';
import { DateConverter } from '../date-converter.component';
import { DefinitionInterface } from '../../persistence/interface/definition.interface';

@Injectable()
export class InstanceModelToTypeMapper {
    constructor(private readonly dateConverter: DateConverter) {}

    mapOne(
        instance: InstanceInterface,
        definition: DefinitionInterface,
    ): InstanceTypeInterface {
        return {
            id: instance._id,
            hash: instance.hash,
            name: instance.name,
            definitionId: instance.definitionId.toString(),
            services: instance.services,
            envVariables: instance.envVariables,
            proxiedPorts: instance.proxiedPorts,
            downloadables: instance.downloadables,
            summaryItems: instance.summaryItems,
            createdAt: this.dateConverter.convertDate(instance.createdAt),
            updatedAt: this.dateConverter.convertDate(instance.updatedAt),
            completedAt: this.dateConverter.convertDate(instance.completedAt),
            failedAt: this.dateConverter.convertDate(instance.failedAt),
            isModificationAllowed: definition.updatedAt <= instance.createdAt,
        } as InstanceTypeInterface;
    }
}
