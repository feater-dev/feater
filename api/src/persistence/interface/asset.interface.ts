import {Document} from 'mongoose';

export interface AssetInterface extends Document {
    readonly _id: string;
    readonly id: string;
    readonly projectId: string;
    readonly filename: string;
    readonly description: string;
    readonly createdAt: Date;
}
