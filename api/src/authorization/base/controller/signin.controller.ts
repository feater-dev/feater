import { Controller, Get, Response } from '@nestjs/common';

@Controller('/signin')
export class SigninController {

    @Get()
    list(
        @Response() res,
    ) {
        res.render('signin');
    }

}
