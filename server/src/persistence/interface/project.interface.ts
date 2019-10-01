import { Document } from 'mongoose';

export interface ProjectInterface extends Document {
    readonly _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
