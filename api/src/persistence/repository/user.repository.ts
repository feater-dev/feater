import {Model} from 'mongoose';
import {Component} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {UserSchema} from '../schema/user.schema';
import {UserInterface} from '../interface/user.interface';
import {GithubUserProfileInterface} from '../../authorization/signin-strategy/github-oauth2/github-user-profile.interface';
import {GoogleUserProfileInterface} from '../../authorization/signin-strategy/google-oauth2/google-user-profile.interface';
import {ProjectInterface} from '../interface/project.interface';

@Component()
export class UserRepository {

    constructor(
        @InjectModel(UserSchema) private readonly userModel: Model<UserInterface>,
    ) {}

    find(criteria: object, offset: number, limit: number, sort?: object): Promise<UserInterface[]> {
        const query = this.userModel.find(criteria);
        query
            .skip(offset)
            .limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    findById(id: string): Promise<UserInterface> {
        return this.userModel.findById(id).exec();
    }

    findByGithubId(id: string): Promise<UserInterface[]> {
        return this.find({'githubProfile.id': id}, 0, 9999);
    }

    findByGoogleId(id: string): Promise<UserInterface[]> {
        return this.find({'googleProfile.id': id}, 0, 9999);
    }

    createForGithubProfile(githubProfile: GithubUserProfileInterface): Promise<UserInterface> {
        const createdUser = new this.userModel({
            name: githubProfile.displayName,
            githubProfile,
        } as UserInterface);

        return new Promise(resolve => {
            createdUser.save();
            resolve(createdUser);
        });
    }

    createForGoogleProfile(googleProfile: GoogleUserProfileInterface): Promise<UserInterface> {
        const createdUser = new this.userModel({
            name: googleProfile.displayName,
            googleProfile,
        } as UserInterface);

        return new Promise(resolve => {
            createdUser.save();
            resolve(createdUser);
        });
    }

}
