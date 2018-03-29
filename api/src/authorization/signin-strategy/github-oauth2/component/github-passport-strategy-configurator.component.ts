import * as passport from 'passport';
import { Component } from '@nestjs/common';
import { Strategy } from 'passport-github';
import { Config } from '../../../../config/config.component';
import { UserRepository } from '../../../../persistence/repository/user.repository';
import { GithubUserProfileInterface } from '../github-user-profile.interface';

@Component()
export class GithubPassportStrategyConfigurationComponent {

    constructor(
        private readonly config: Config,
        private readonly userRepository: UserRepository,
    ) {}

    configure() {
        passport.use(new Strategy(
            {
                clientID: this.config.githubOAuth2.clientId,
                clientSecret: this.config.githubOAuth2.clientSecret,
                callbackURL: this.config.githubOAuth2.baseUrl + '/signin/github/callback',
            },
            (accessToken, refreshToken, profile, done) => {

                // TODO Check organization etc.
                // TODO Do we need to keep access token for future API calls?
                // TODO Find user or create one if needed, see https://scotch.io/tutorials/easy-node-authentication-github

                this.userRepository
                    .findByGithubId(profile.id)
                    .then(existingUsers => {
                        if (0 === existingUsers.length) {

                            this.userRepository
                                .createForGithubProfile({
                                    username: profile.username,
                                    id: profile.id,
                                    displayName: profile.displayName,
                                    emailAddresses: profile.emails.map(email => email.value),
                                } as GithubUserProfileInterface)
                                .then(createdUser => {
                                    done(null, createdUser);
                                });

                        } else {

                            done(null, existingUsers[0]);

                        }
                    });

            },
        ));
    }

}