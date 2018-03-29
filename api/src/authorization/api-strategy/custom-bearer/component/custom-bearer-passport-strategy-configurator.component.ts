import * as passport from 'passport';
import * as Strategy from 'passport-http-custom-bearer';
import { Component } from '@nestjs/common';
import { Config } from '../../../../config/config.component';
import { ApiTokenRepository } from '../../../../persistence/repository/api-token.repository';
import { UserRepository } from '../../../../persistence/repository/user.repository';
import { apiTokenHeader } from '../../../authorization.module';

@Component()
export class CustomBearerPassportStrategyConfiguratorComponent {

    constructor(
        private readonly config: Config,
        private readonly apiTokenRepository: ApiTokenRepository,
        private readonly userRepository: UserRepository,
    ) {}

    configure() {

        passport.use(
            new Strategy(
                { headerName: apiTokenHeader },
                (apiTokenValue, done) => {
                    this.apiTokenRepository
                        .findByValue(apiTokenValue)
                        .then(apiTokens => {
                            if (1 !== apiTokens.length) {
                                done(null, false);

                                throw new Error('Invalid API token.');
                            }
                            return apiTokens[0];
                        })
                        .then(apiToken => {
                            return this.userRepository.findById(apiToken.userId);
                        })
                        .then(user => {
                            if (!user) {
                                done(null, false);

                                throw new Error('User not found for API token.');
                            }

                            done(null, user || false, {});
                        })
                        .catch(error => {
                            // Noop.
                        });
                },
            ),
        );
    }
}
