import * as _ from 'lodash';
import * as passport from 'passport';
import {Component} from '@nestjs/common';
import {OAuth2Strategy as Strategy} from 'passport-google-oauth';
import {GoogleUserProfileInterface} from '../google-user-profile.interface';
import {UserRepository} from '../../../../persistence/repository/user.repository';
import {environment} from '../../../../environment/environment';

@Component()
export class GooglePassportStrategyConfigurationComponent {

    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    configure() {
        passport.use(new Strategy(
            {
                clientID: environment.googleOAuth2.clientId,
                clientSecret: environment.googleOAuth2.clientSecret,
                callbackURL: environment.googleOAuth2.baseUrl + '/signin/google/callback',
            },
            (accessToken, refreshToken, profile, done) => {
                const isAllowedDomain = _.find(
                    environment.googleOAuth2.allowedDomains,
                    (allowedDomain) => allowedDomain === profile._json.domain,
                );
                if (!isAllowedDomain) {
                    // TODO How should app behave here apart from returning error?
                    return done(
                        new Error(`Invalid domain ${profile._json.domain} for Google authentication.`),
                    );
                }

                // TODO Find user or create one if needed, see https://scotch.io/tutorials/easy-node-authentication-google

                this.userRepository
                    .findByGoogleId(profile.id)
                    .then(existingUsers => {
                        if (0 === existingUsers.length) {

                            this.userRepository
                                .createForGoogleProfile({
                                    id: profile.id,
                                    firstName: profile.name.givenName,
                                    lastName: profile.name.familyName,
                                    displayName: profile.displayName,
                                    emailAddress: profile.emails[0].value,
                                    domain: profile._json.domain,
                                } as GoogleUserProfileInterface)
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