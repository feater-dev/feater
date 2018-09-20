import {Schema} from 'mongoose';

export const AssetSchema = new Schema({
    projectId: String,
    id: String,
    description: String,
    uploaded: Boolean,
    createdAt: Date,
});
