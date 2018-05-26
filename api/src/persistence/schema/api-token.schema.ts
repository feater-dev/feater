import {Schema} from 'mongoose';

export const ApiTokenSchema = new Schema({
    value: String,
    userId: String,
});
