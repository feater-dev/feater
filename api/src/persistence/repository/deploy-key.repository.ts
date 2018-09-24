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

    find(criteria: object, offset: number, limit: number, sort?: object): Promise<DeployKeyInterface[]> {
        const query = this.deployKeyModel.find(criteria);
        query.skip(offset).limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    async findOne(criteria: object): Promise<DeployKeyInterface> {
        const deployKeys = await this.find(criteria, 0, 2);
        if (1 < deployKeys.length) {
            throw new Error('More than one deploy key found.');
        }
        if (0 === deployKeys.length) {
            throw new Error('No deploy key found.');
        }

        return deployKeys[0];
    }

    async findBySshCloneUrl(sshCloneUrl: string): Promise<DeployKeyInterface> {
        return await this.findOne({sshCloneUrl});
    }

    async findById(id: string): Promise<DeployKeyInterface> {
        return await this.findOne({_id: id});
    }

    async existsForSshCloneUrl(sshCloneUrl: string): Promise<boolean> {
        const deployKeys = await this.find({sshCloneUrl}, 0, 2);
        if (1 < deployKeys.length) {
            throw new Error();
        }

        return (1 === deployKeys.length);
    }

    async create(sshCloneUrl: string, overwrite: boolean = false): Promise<DeployKeyInterface> {
        const oldModels = await this.find({sshCloneUrl}, 0, 2);
        if (1 < oldModels.length) {
            throw new Error('More than one deploy key found.');
        }

        const passphrase = nanoid(32);
        const {publicKey, privateKey} = await easyKeygen(null, {passphrase});

        let model;
        if (1 === oldModels.length) {
            model = oldModels[0];
            model.publicKey = publicKey;
            model.privateKey = privateKey;
            model.passphrase = passphrase;
        } else {
            model = new this.deployKeyModel({
                sshCloneUrl,
                publicKey,
                privateKey,
                passphrase,
            } as DeployKeyInterface);
        }

        await model.save();

        return model;
    }

}
