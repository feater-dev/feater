import {Schema} from 'mongoose';

export const DefinitionSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    name: String,
    configAsYaml: String,
    createdAt: Date,
    updatedAt: Date,
});
