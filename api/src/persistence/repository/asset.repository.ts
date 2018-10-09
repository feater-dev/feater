import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AssetInterface} from '../interface/asset.interface';
import {CreateAssetInputTypeInterface} from '../../graphql/input-type/create-asset-input-type.interface';

@Injectable()
export class AssetRepository {

    constructor(
        @InjectModel('Asset') private readonly assetModel: Model<AssetInterface>,
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
}
