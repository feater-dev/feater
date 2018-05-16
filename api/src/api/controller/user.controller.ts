import * as _ from 'lodash';
import { Controller, Get, Post, Response, Param, HttpStatus, Body, Request } from '@nestjs/common';
import { Validator } from '../validation/validator.component';
import { UserRepository } from '../../persistence/repository/user.repository';
import {
    FindAllUserGithubProfileResponseDto,
    FindAllUserGoogleProfileResponseDto,
    FindAllUserResponseDto,
} from '../dto/response/find-all-user-response.dto';
import { FindOneUserResponseDto } from '../dto/response/find-one-user-response.dto';

@Controller('/api/user')
export class UserController {

    constructor(
        private readonly validator: Validator,
        private readonly userRepository: UserRepository,
    ) {}

    @Get()
    async findAll(
        @Request() req,
        @Response() res,
    ): Promise<any> {
        const users = await this.userRepository.find({});
        const data: FindAllUserResponseDto[] = [];

        for (const user of users) {
            const mappedUser = {
                _id: user._id,
                name: user.name,
            } as FindAllUserResponseDto;

            if (user.googleProfile) {
                mappedUser.googleProfile = {
                    emailAddress: user.googleProfile.emailAddress,
                } as FindAllUserGoogleProfileResponseDto;
            }

            if (user.githubProfile) {
                mappedUser.githubProfile = {
                    username: user.githubProfile.username,
                } as FindAllUserGithubProfileResponseDto;
            }

            data.push(mappedUser);
        }

        res.status(HttpStatus.OK).json(data);
    }

    @Get(':id')
    async findOne(
        @Response() res,
        @Param() params,
    ): Promise<any> {
        const id: string = params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(HttpStatus.BAD_REQUEST).send();

            return;
        }
        const user = await this.userRepository.findById(params.id);
        if (null === user) {
            res.status(HttpStatus.NOT_FOUND).send();

            return;
        }
        res.status(HttpStatus.OK).json(
            {
                _id: user._id,
                name: user.name,
            } as FindOneUserResponseDto
        );
    }

}
