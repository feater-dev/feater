import * as passport from 'passport';
import {ExpressMiddleware, Middleware, NestMiddleware} from '@nestjs/common';

@Middleware()
export class PassportInitializeMiddleware implements NestMiddleware {
    resolve(): ExpressMiddleware {
        return passport.initialize();
    }
}