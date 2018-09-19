import {Model, Types} from 'mongoose';
import {Component} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {DeployKeySchema} from '../schema/deploy-key.schema';
import {DeployKeyInterface} from '../interface/deploy-key.interface';
import * as nanoid from 'nanoid';
import * as easyKeygen from 'easy-keygen';

@Component()
export class DeployKeyRepository {

    constructor(
        @InjectModel(DeployKeySchema) private readonly deployKeyModel: Model<DeployKeyInterface>,
    ) {}

    async findByRepositoryOwnerAndName(repositoryOwner: string, repositoryName: string): Promise<DeployKeyInterface> {
        const deployKeys = await this.find({repositoryOwner, repositoryName}, 0, 2);
        if (1 < deployKeys.length) {
            throw new Error('More than one deploy key found.');
        }
        if (0 === deployKeys.length) {
            throw new Error('No deploy key found.');
        }

        return deployKeys[0];
    }

    async existsForRepositoryOwnerAndName(repositoryOwner: string, repositoryName: string): Promise<boolean> {
        const deployKeys = await this.find({repositoryOwner, repositoryName}, 0, 2);
        if (1 < deployKeys.length) {
            throw new Error();
        }

        return (1 === deployKeys.length);
    }

    async create(repositoryOwner: string, repositoryName: string): Promise<DeployKeyInterface> {
        const passphrase = nanoid(32);
        const {publicKey, privateKey} = await easyKeygen(null, {passphrase});
        const model = new this.deployKeyModel({
            repositoryName,
            repositoryOwner,
            publicKey,
            privateKey,
            passphrase,
        } as DeployKeyInterface);
        await model.save();

        return model;
    }

    protected find(criteria: object, offset: number, limit: number, sort?: object): Promise<DeployKeyInterface[]> {
        const query = this.deployKeyModel.find(criteria);
        query.skip(offset).limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }
}
