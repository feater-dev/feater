import {InstanceServiceTypeInterface} from './instance-service-type.interface';

export interface InstanceTypeInterface {
    readonly id: string;
    readonly hash: string;
    readonly name: string;
    readonly definitionId: string;
    readonly services: InstanceServiceTypeInterface[];
    readonly summaryItems: any;
    readonly envVariables: any;
    readonly proxiedPorts: any;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly completedAt: Date;
    readonly failedAt: Date;
}
