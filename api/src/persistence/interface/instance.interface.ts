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
    readonly environmentalVariables: {
        readonly key: string;
        readonly value: string;
    }[];
}
