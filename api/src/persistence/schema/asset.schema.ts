import {Schema} from 'mongoose';

export const AssetSchema = new Schema({
    projectId: String,
    id: String,
    description: String,
    filename: String,
    createdAt: Date,
});
