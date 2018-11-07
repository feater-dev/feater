import {Document} from 'mongoose';

export interface LogInterface extends Document {
    level: string;
    message: string;
    meta: any;
    timestamp: Date;
}
