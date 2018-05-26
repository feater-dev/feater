import {Component} from '@nestjs/common';
import {Config} from '../../../config/config.component';
import {ApiTokenRepository} from '../../../persistence/repository/api-token.repository';

@Component()
export class SpaRedirectorComponent {

    constructor(
        private readonly config: Config,
        private readonly apiTokenRepository: ApiTokenRepository,
    ) {}

    createApiTokenAndRedirect(user, req, res, next) {
        this.apiTokenRepository.createForUser(user)
            .then(apiToken => {
                req.login(
                    user,
                    loginErr => {
                        if (loginErr) {
                            return next(loginErr);
                        }

                        // TODO Get base URL of SPA from config.
                        return res.redirect(`http://localhost:3000/#${apiToken.value}`);
                    },
                );
            });
    }
}
