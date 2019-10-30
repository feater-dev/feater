import { InstanceServiceTypeInterface } from './instance-service-type.interface';

export interface InstanceTypeInterface {
    readonly id: string;
    readonly hash: string;
    readonly name: string;
    readonly definitionId: string;
    readonly services: InstanceServiceTypeInterface[];
    readonly envVariables: unknown;
    readonly proxiedPorts: unknown;
    readonly downloadables: {
        readonly id: string;
        readonly name: string;
        readonly serviceId: string;
        readonly absolutePath: string;
    }[];
    readonly summaryItems: unknown;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly completedAt: string;
    readonly failedAt: string;
    readonly isModificationAllowed: boolean;
}
