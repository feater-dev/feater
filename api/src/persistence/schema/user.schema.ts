import {Schema} from 'mongoose';

export const UserSchema = new Schema({
    name: String,
    githubProfile: {
        username: String,
        id: String,
        displayName: String,
        emailAddresses: [String],
    },
    googleProfile: {
        id: String,
        firstName: String,
        lastName: String,
        displayName: String,
        emailAddress: String,
        domain: String,
    },
});
