import { Document } from 'mongoose';

export interface CommandLogInterface extends Document {
    readonly _id: string;
    readonly actionLogId: string;
    readonly instanceId: string;
    readonly instanceHash: string;
    description: string;
    createdAt: Date;
    updatedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
}
