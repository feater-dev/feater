import {Document} from 'mongoose';

export interface CommandLogDetailItemInterface {
    readonly name: string;
    value: string;
}

export interface CommandLogInterface extends Document {
    readonly taskId: string;
    readonly instanceId: string;
    readonly instanceHash: string;
    readonly description: string;
    readonly details: CommandLogDetailItemInterface[];
    readonly createdAt: Date;
    updatedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
}
