import { Document } from 'mongoose';

export interface CommandLogDetailItemInterface {
    name: string;
    value: string;
}

export interface CommandLogInterface extends Document {
    taskId: string;
    instanceId: string;
    instanceHash: string;
    description: string;
    details: CommandLogDetailItemInterface[];
    createdAt: Date;
    updatedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
}
