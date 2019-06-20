import {Document} from 'mongoose';

export interface DefinitionInterface extends Document {
    readonly _id: string;
    projectId: string;
    name: string;
    configAsYaml: string;
    createdAt: Date;
    updatedAt: Date;
}
