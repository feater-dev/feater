import {Schema} from 'mongoose';

export const DeployKeySchema = new Schema({
    sshCloneUrl: String,
    publicKey: String,
    privateKey: String,
    passphrase: String,
});
