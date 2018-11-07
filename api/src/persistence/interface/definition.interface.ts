import {Document} from 'mongoose';

export interface DefinitionInterface extends Document {
    _id: string;
    projectId: string;
    name: string;
    config: any; // TODO Add interface for this.
    createdAt: Date;
    updatedAt: Date;
}
