import * as passport from 'passport';
import {Injectable, MiddlewareFunction, NestMiddleware} from '@nestjs/common';

@Injectable()
export class CustomBearerAuthenticationMiddleware implements NestMiddleware {
    resolve(): MiddlewareFunction {
        return passport.authenticate('custom-bearer', {session: false});
    }
}
