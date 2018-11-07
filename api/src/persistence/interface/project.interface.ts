import {Document} from 'mongoose';

export interface ProjectInterface extends Document {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
