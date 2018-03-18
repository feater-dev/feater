import * as mongoose from 'mongoose';

export const BuildInstanceSchema = new mongoose.Schema({
    buildDefinitionId: String,
    name: String,
}, {strict: false});
