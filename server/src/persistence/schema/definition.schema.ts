import {Schema} from 'mongoose';

export const DefinitionSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    name: String,
    config: Schema.Types.Mixed,
    createdAt: Date,
    updatedAt: Date,
});
