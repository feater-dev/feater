import {Document} from 'mongoose';

export interface DeployKeyInterface extends Document {
    readonly _id: string;
    readonly sshCloneUrl: string;
    readonly publicKey: string;
    readonly privateKey: string;
    readonly passphrase: string;
}
