import {Document} from 'mongoose';

export interface InstanceInterface extends Document {
    _id: string;
    definitionId: string;
    hash: string;
    name: string;
    services: any;
    summaryItems: {
        name: string;
        value: string;
    }[];
    envVariables: {
        name: string;
        value: string;
    }[];
    proxiedPorts: {
        id: string;
        serviceId: string;
        name: string;
        port: number;
        domain?: string;
        nginxConfig?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
