import {Document} from 'mongoose';
import {GoogleUserProfileInterface} from '../../authorization/signin-strategy/google-oauth2/google-user-profile.interface';
import {GithubUserProfileInterface} from '../../authorization/signin-strategy/github-oauth2/github-user-profile.interface';

export interface UserInterface extends Document {
    readonly _id: string;
    readonly name: string;
    readonly googleProfile: GoogleUserProfileInterface;
    readonly githubProfile: GithubUserProfileInterface;
}
