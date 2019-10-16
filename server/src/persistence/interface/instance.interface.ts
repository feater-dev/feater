import { Document } from 'mongoose';

export interface InstanceServiceInterface {
    id: string;
    containerNamePrefix: string;
    containerId?: string;
    ipAddress?: string;
}

export interface InstanceDownloadableInterface {
    id: string;
    name: string;
    serviceId: string;
    absolutePath: string;
}

export interface InstanceInterface extends Document {
    readonly _id: string;
    hash: string;
    definitionId: string;
    name: string;
    services: InstanceServiceInterface[];
    sourceVolumes: {
        id: string;
        dockerVolumeName: string;
    }[];
    assetVolumes: {
        id: string;
        dockerVolumeName: string;
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
    downloadables: InstanceDownloadableInterface[];
    summaryItems: {
        name: string;
        value: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
    failedAt: Date;
}
