import {Document} from 'mongoose';

export interface DefinitionInterface extends Document {
    readonly _id: string;
    readonly projectId: string;
    readonly name: string;
    readonly config: any; // TODO Add interface for this.
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
