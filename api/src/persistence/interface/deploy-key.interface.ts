import {Document} from 'mongoose';

export interface DeployKeyInterface extends Document {
    readonly _id: string;
    readonly cloneUrl: string;
    readonly publicKey: string;
    readonly privateKey: string;
    readonly passphrase: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
