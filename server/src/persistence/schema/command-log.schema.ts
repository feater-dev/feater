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
    instanceId: {
        type: Schema.Types.ObjectId,
        ref: 'Instance',
    },
    description: String,
    details: [CommandLogDetailItemSchema],
    createdAt: Date,
    updatedAt: Date,
    completedAt: Date,
    failedAt: Date,
});
