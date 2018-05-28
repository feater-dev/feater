import {Document} from 'mongoose';

export interface ApiTokenInterface extends Document {
    readonly _id: string;
    readonly value: string;
    readonly userId: string;
}
