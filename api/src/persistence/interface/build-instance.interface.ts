import { Document } from 'mongoose';

export interface BuildInstanceInterface extends Document {
    readonly _id: string;
    readonly buildDefinitionId: string;
    readonly hash: string;
    readonly name: string;
    readonly services: any;
    readonly summaryItems: {
        readonly name: string;
        readonly value: string;
    }[];
    readonly environmentalVariables: {
        readonly name: string;
        readonly value: string;
    }[];
}
