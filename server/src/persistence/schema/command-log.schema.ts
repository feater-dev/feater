import { Schema } from 'mongoose';

export const CommandLogSchema = new Schema(
    {
        actionLogId: String,
        instanceId: String, // TODO Remove if possible, can be retrieved from action log or replaced with log file path.
        instanceHash: String, // TODO Remove if possible, can be retrieved from action log or replaced with log file path.
        description: String,
        createdAt: Date,
        updatedAt: Date,
        completedAt: Date,
        failedAt: Date,
    },
    {
        strict: true,
    },
);
