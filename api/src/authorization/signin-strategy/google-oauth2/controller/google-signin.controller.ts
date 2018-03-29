import * as passport from 'passport';
import { Controller, Get, Next, Request, Response } from '@nestjs/common';
import { Config } from '../../../../config/config.component';
import { SpaRedirectorComponent } from '../../../base/component/spa-redirector.component';

@Controller('/signin/google')
export class GoogleSigninController {

    constructor(
        private readonly config: Config,
        private readonly spaRedirectorComponent: SpaRedirectorComponent,
    ) {}

    @Get()
    authenticate(
        @Request() req,
        @Response() res,
        @Next() next,
    ) {
        passport.authenticate(
            'google',
            {scope: ['profile', 'email']},
        )(req, res, next);
    }

    @Get('/callback')
    authenticateCallback(
        @Request() req,
        @Response() res,
        @Next() next,
    ) {
        passport.authenticate(
            'google',
            (authenticateErr, user, info) => {
                if (authenticateErr) {
                    return next(authenticateErr);
                }

                if (!user) {
                    return res.redirect('/signin/google');
                }

                this.spaRedirectorComponent.createApiTokenAndRedirect(user, req, res, next);
            },
        )(req, res, next);
    }

}
