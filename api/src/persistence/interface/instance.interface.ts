import {Document} from 'mongoose';

export interface InstanceInterface extends Document {
    readonly _id: string;
    readonly definitionId: string;
    readonly hash: string;
    readonly name: string;
    readonly services: any;
    readonly summaryItems: {
        readonly name: string;
        readonly value: string;
    }[];
    readonly envVariables: {
        readonly name: string;
        readonly value: string;
    }[];
    readonly proxiedPorts: {
        readonly id: string;
        readonly serviceId: string;
        readonly name: string;
        readonly port: number;
        readonly proxyDomain: string;
    }[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
