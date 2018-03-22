import { Document } from 'mongoose';

export interface BuildDefinitionInterface extends Document {
    readonly _id: string;
    readonly projectId: string;
    readonly name: string;
    readonly config: any; // TODO Add interface for this.
}
