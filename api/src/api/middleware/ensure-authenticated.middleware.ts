import {HttpStatus, NestMiddleware, Injectable, MiddlewareFunction} from '@nestjs/common';

@Injectable()
export class EnsureAuthenticatedMiddleware implements NestMiddleware {

    resolve(): MiddlewareFunction {
        return (req, res, next) => {
            next();

            // if (!req.user) {
            //     res.status(HttpStatus.FORBIDDEN).send();
            //
            //     return;
            // }
            // next();
        };
    }

}
