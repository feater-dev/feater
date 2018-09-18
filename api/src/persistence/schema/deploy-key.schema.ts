import {Schema} from 'mongoose';

export const DeployKeySchema = new Schema({
    repositoryOwner: String,
    repositoryName: String,
    publicKey: String,
    privateKey: String,
});
