import {Document} from 'mongoose';

export interface DeployKeyInterface extends Document {
    readonly _id: string;
    cloneUrl: string;
    publicKey: string;
    passphrase: string;
    createdAt: Date;
    updatedAt: Date;
}
