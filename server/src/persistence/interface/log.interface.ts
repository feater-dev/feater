import {Document} from 'mongoose';

export interface LogInterface extends Document {
    readonly level: string;
    message: string;
    meta: any;
    timestamp: Date;
}
