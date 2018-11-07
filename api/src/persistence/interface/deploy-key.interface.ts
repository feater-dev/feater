import {Document} from 'mongoose';

export interface DeployKeyInterface extends Document {
    _id: string;
    cloneUrl: string;
    publicKey: string;
    privateKey: string;
    passphrase: string;
    createdAt: Date;
    updatedAt: Date;
}
