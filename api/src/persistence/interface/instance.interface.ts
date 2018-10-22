import {Document} from 'mongoose';

export interface InstanceInterface extends Document {
    readonly _id: string;
    readonly definitionId: string;
    readonly hash: string;
    readonly name: string;
    services: any;
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
        readonly serviceId: string;
        readonly name: string;
        readonly port: number;
        readonly domain?: string;
        readonly nginxConfig?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
