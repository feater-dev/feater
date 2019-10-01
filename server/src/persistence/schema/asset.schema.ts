import { Schema } from 'mongoose';

export const AssetSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    id: String,
    description: String,
    uploaded: Boolean,
    createdAt: Date,
    updatedAt: Date,
});
