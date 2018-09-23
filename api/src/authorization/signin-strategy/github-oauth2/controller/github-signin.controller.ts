import * as passport from 'passport';
import {Controller, Get, Next, Request, Response} from '@nestjs/common';
import {SpaRedirectorComponent} from '../../../base/component/spa-redirector.component';

@Controller('/signin/github')
export class GithubSigninController {

    constructor(
        private readonly spaRedirectorComponent: SpaRedirectorComponent,
    ) {}

    @Get()
    authenticate(
        @Request() req,
        @Response() res,
        @Next() next,
    ) {
        passport.authenticate(
            'github',
            { scope: ['profile', 'user:email'] },
        )(req, res, next);
    }

    @Get('/callback')
    authenticateCallback(
        @Request() req,
        @Response() res,
        @Next() next,
    ) {
        passport.authenticate(
            'github',
            (authenticateErr, user, info) => {
                if (authenticateErr) {
                    return next(authenticateErr);
                }

                if (!user) {
                    return res.redirect('/signin/github');
                }

                this.spaRedirectorComponent.createApiTokenAndRedirect(user, req, res, next);
            },
        )(req, res, next);
    }

}
