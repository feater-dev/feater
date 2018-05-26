import * as passport from 'passport';
import {ExpressMiddleware, Middleware, NestMiddleware} from '@nestjs/common';

@Middleware()
export class CustomBearerAuthenticationMiddleware implements NestMiddleware {
    resolve(): ExpressMiddleware {
        return passport.authenticate('custom-bearer', {session: false});
    }
}