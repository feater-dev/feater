import { Schema } from 'mongoose';

export const ActionLogSchema = new Schema(
    {
        instanceId: String,
        actionId: String,
        actionType: String,
        actionName: String,
        createdAt: Date,
        updatedAt: Date,
        completedAt: Date,
        failedAt: Date,
    },
    {
        strict: true,
    },
);
