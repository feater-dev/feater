import {Document} from 'mongoose';

export interface InstanceInterface extends Document {
    readonly _id: string;
    hash: string;
    definitionId: string;
    name: string;
    services: {
        id: string;
        containerNamePrefix: string;
        containerId?: string;
        ipAddress?: string;
    }[];
    summaryItems: {
        name: string;
        value: string;
    }[];
    envVariables: {
        name: string;
        value: string;
    }[];
    featerVariables: {
        name: string;
        value: string;
    }[];
    proxiedPorts: {
        id: string;
        name: string;
        serviceId: string;
        port: number;
        domain?: string;
        nginxConfig?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
    failedAt: Date;
}
