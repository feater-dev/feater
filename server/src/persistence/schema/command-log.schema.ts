import {Schema} from 'mongoose';

const CommandLogDetailItemSchema = new Schema(
    {
        name: String,
        value: Schema.Types.Mixed,
    }, {
        _id: false,
    },
);

export const CommandLogSchema = new Schema({
    taskId: String,
    instanceId: String,
    description: String,
    details: [CommandLogDetailItemSchema],
    createdAt: Date,
    updatedAt: Date,
    completedAt: Date,
    failedAt: Date,
});

// TODO Add index.
