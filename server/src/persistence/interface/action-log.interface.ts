import { Document } from 'mongoose';

export interface ActionLogInterface extends Document {
    readonly _id: string;
    readonly instanceId: string;
    readonly actionId: string;
    readonly actionType: string;
    readonly actionName: string;
    createdAt: Date;
    updatedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
}
