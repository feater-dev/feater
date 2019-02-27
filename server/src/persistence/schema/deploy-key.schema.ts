import {Schema} from 'mongoose';

export const DeployKeySchema = new Schema({
    cloneUrl: String,
    publicKey: String,
    passphrase: String,
    createdAt: Date,
    updatedAt: Date,
});
