import {Document} from 'mongoose';

export interface ProjectInterface extends Document {
    readonly _id: string;
    readonly name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
