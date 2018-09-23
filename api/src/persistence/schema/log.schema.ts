import {Schema} from 'mongoose';

export const LogSchema = new Schema({
    level: String,
    message: String,
    meta: Schema.Types.Mixed,
    timestamp: Date,
});
