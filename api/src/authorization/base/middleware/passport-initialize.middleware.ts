import * as passport from 'passport';
import {Injectable, MiddlewareFunction, NestMiddleware} from '@nestjs/common';

@Injectable()
export class PassportInitializeMiddleware implements NestMiddleware {
    resolve(): MiddlewareFunction {
        return passport.initialize();
    }
}
