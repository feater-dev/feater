import {Schema} from 'mongoose';

export const ProjectSchema = new Schema({
    name: String,
    createdAt: Date,
    updatedAt: Date,
});
