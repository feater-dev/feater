import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AssetInterface} from '../interface/asset.interface';
import {CreateAssetInputTypeInterface} from '../../api/input-type/create-asset-input-type.interface';
import {AssetHelper} from '../helper/asset-helper.component';
import * as rimraf from 'rimraf';

@Injectable()
export class AssetRepository {

    constructor(
        @InjectModel('Asset') private readonly assetModel: Model<AssetInterface>,
        private readonly assetHelper: AssetHelper,
    ) {}

    async find(criteria: object, offset: number, limit: number, sort?: object): Promise<AssetInterface[]> {
        const query = this.assetModel.find(criteria);
        query
            .skip(offset)
            .limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    async findOneOrFail(criteria: object): Promise<AssetInterface> {
        const assets = await this.find(criteria, 0, 2);
        if (assets.length > 1) {
            throw new Error(`More than one asset document found.`);
        }
        if (assets.length === 0) {
            throw new Error(`No asset document found.`);
        }

        return assets.pop();
    }

    findById(id: string): Promise<AssetInterface> {
        return this.assetModel.findById(id).exec();
    }

    async findByIdOrFail(id: string): Promise<AssetInterface> {
        const asset = await this.findById(id);
        if (null === asset) {
            throw new Error(`Asset document with id ${id} not found.`);
        }

        return asset;
    }

    async findByProjectIdAndIdentifierOrFail(
        projectId: string,
        identifier: string,
    ): Promise<AssetInterface> {
        // TODO Find better name for identifier.
        const asset = this.assetModel.findOne({projectId, id: identifier});
        if (!asset) {
            throw new Error(`Asset document with project ID ${projectId} identifier ${identifier} not found.`);
        }

        return asset;
    }

    async findUploadedById(id: string): Promise<AssetInterface> {
        const assets = await this.find({id, uploaded: true}, 0, 1);
        if (0 === assets.length) {
            throw new Error(`No assets with id '${id}' found.`);
        }
        if (assets.length > 1) {
            throw new Error(`Multiple assets with id '${id}' found.`);
        }

        return assets[0];
    }

    create(createAssetInputType: CreateAssetInputTypeInterface): Promise<AssetInterface> {
        const createdAsset = new this.assetModel(createAssetInputType);
        createdAsset.createdAt = new Date();
        createdAsset.updatedAt = new Date();

        return new Promise(resolve => {
            createdAsset.save();
            resolve(createdAsset);
        });
    }

    async markAsUploaded(id: string): Promise<any> {
        const persistentAsset = await this.findById(id);
        persistentAsset.set({uploaded: true});
        persistentAsset.set({updatedAt: new Date()});
        await persistentAsset.save();
    }

    async removeByProjectIdAndIdentifier(projectId: string, identifier: string): Promise<boolean> {
        const asset = await this.findByProjectIdAndIdentifierOrFail(projectId, identifier);
        const uploadPaths = this.assetHelper.getUploadPaths(asset);
        rimraf.sync(uploadPaths.absolute);
        const removal = await this.assetModel.findByIdAndRemove(asset._id);

        return true;
    }
}
