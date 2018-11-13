import {Document} from 'mongoose';

export interface InstanceInterface extends Document {
    readonly _id: string;
    readonly definitionId: string;
    readonly name: string;
    hash: string;
    services: {
        readonly id: string;
        readonly containerNamePrefix: string;
        readonly containerId?: string;
        readonly ipAddress?: string;
    }[];
    summaryItems: {
        readonly name: string;
        readonly value: string;
    }[];
    envVariables: {
        readonly name: string;
        readonly value: string;
    }[];
    proxiedPorts: {
        readonly id: string;
        readonly name: string;
        readonly serviceId: string;
        readonly port: number;
        readonly domain?: string;
        readonly nginxConfig?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
    failedAt: Date;
}
