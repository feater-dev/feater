import {HttpStatus, NestMiddleware, ExpressMiddleware, Middleware} from '@nestjs/common';

@Middleware()
export class EnsureAuthenticatedMiddleware implements NestMiddleware {

    resolve(): ExpressMiddleware {
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
