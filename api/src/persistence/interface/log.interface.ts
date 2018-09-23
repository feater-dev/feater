import {Document} from 'mongoose';

export interface LogInterface extends Document {
    readonly level: string;
    readonly message: string;
    readonly meta: any;
    readonly timestamp: Date;
}
