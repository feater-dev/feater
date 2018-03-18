import * as mongoose from 'mongoose';

export const BuildDefinitionSchema = new mongoose.Schema({
    projectId: String,
    name: String,
}, {strict: false});
