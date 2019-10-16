import * as easyKeygen from 'easy-keygen';
import { writeFileSync } from 'fs';
import * as uuidVersion4 from 'uuid/v4';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeployKeyInterface } from '../interface/deploy-key.interface';
import { DeployKeyHelperComponent } from '../../helper/deploy-key-helper.component';

@Injectable()
export class DeployKeyRepository {
    constructor(
        @InjectModel('DeployKey')
        private readonly deployKeyModel: Model<DeployKeyInterface>,
        private readonly deployKeyHelper: DeployKeyHelperComponent,
    ) {}

    find(
        criteria: any,
        offset: number,
        limit: number,
        sort?: any,
    ): Promise<DeployKeyInterface[]> {
        const query = this.deployKeyModel.find(criteria);
        query.skip(offset).limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    async findOne(criteria: any): Promise<DeployKeyInterface> {
        const deployKeys = await this.find(criteria, 0, 2);
        if (1 < deployKeys.length) {
            throw new Error('More than one deploy key found.');
        }
        if (0 === deployKeys.length) {
            throw new Error('No deploy key found.');
        }

        return deployKeys[0];
    }

    async findByCloneUrl(cloneUrl: string): Promise<DeployKeyInterface[]> {
        return await this.find({ cloneUrl }, 0, 2);
    }

    async findOneByCloneUrl(cloneUrl: string): Promise<DeployKeyInterface> {
        return await this.findOne({ cloneUrl });
    }

    async findOneById(id: string): Promise<DeployKeyInterface> {
        return await this.findOne({ _id: id });
    }

    async existsForCloneUrl(cloneUrl: string): Promise<boolean> {
        const deployKeys = await this.find({ cloneUrl }, 0, 2);
        if (1 < deployKeys.length) {
            throw new Error();
        }

        return 1 === deployKeys.length;
    }

    async create(
        cloneUrl: string,
        overwrite: boolean = false,
    ): Promise<DeployKeyInterface> {
        const oldModels = await this.find({ cloneUrl }, 0, 2);
        if (1 < oldModels.length) {
            throw new Error('More than one deploy key found.');
        }

        const passphrase = uuidVersion4().replace(/-/g, '');

        const { publicKey, privateKey } = await easyKeygen(null, {
            passphrase,
        });

        writeFileSync(
            this.deployKeyHelper.getIdentityFileAbsoluteGuestPath(cloneUrl),
            privateKey,
            { mode: 0o400 },
        );

        let model;
        if (1 === oldModels.length) {
            model = oldModels[0];
            if (overwrite) {
                model.publicKey = publicKey;
                model.passphrase = passphrase;
                model.updatedAt = new Date();
            }
        } else {
            model = new this.deployKeyModel({
                cloneUrl,
                publicKey,
                passphrase,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as DeployKeyInterface);
        }

        await model.save();

        return model;
    }

    async remove(cloneUrl: string): Promise<void> {
        return new Promise<void>(resolve => {
            this.deployKeyModel.deleteOne({ cloneUrl }, err => {
                if (err) {
                    throw err;
                }

                resolve();
            });
        });
    }
}
