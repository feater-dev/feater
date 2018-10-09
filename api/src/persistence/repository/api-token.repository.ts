import * as TokenGenerator from 'uuid-token-generator';
import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {ApiTokenInterface} from '../interface/api-token.interface';
import {UserInterface} from '../interface/user.interface';
import {InjectModel} from '@nestjs/mongoose';

const apiTokenBitSize = 256;

@Injectable()
export class ApiTokenRepository {

    private readonly tokenGenerator;

    constructor(
        @InjectModel('ApiToken') private readonly apiTokenModel: Model<ApiTokenInterface>,
    ) {
        this.tokenGenerator = new TokenGenerator(apiTokenBitSize);
    }

    find(query: any): Promise<ApiTokenInterface[]> {
        return this.apiTokenModel.find(query).exec();
    }

    findByValue(value: string): Promise<ApiTokenInterface[]> {
        return this.apiTokenModel.find({value}).exec();
    }

    async createForUser(user: UserInterface): Promise<ApiTokenInterface> {
        const value = this.tokenGenerator.generate(256, TokenGenerator.BASE62);
        const apiTokens = await this.findByValue(value);
        if (0 !== apiTokens.length) {
            throw new Error();
        }

        const createdApiToken = new this.apiTokenModel({
            value,
            userId: user._id,
        } as ApiTokenInterface);

        createdApiToken.save();

        return createdApiToken;
    }

}
