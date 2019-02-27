import {Injectable} from '@nestjs/common';
import {AssetInterface} from '../interface/asset.interface';
import * as path from 'path';
import {config} from '../../config/config';
import {AssetRepository} from '../repository/asset.repository';

export interface AssetUploadPathsInterface {
    readonly relativeToAssetDirectory: string;
    readonly absolute: string;
}

@Injectable()
export class AssetHelper {

    constructor() {}

    getUploadPaths(asset: AssetInterface): AssetUploadPathsInterface {
        const relativeToAssetDirectory = path.join(asset.projectId, asset.id);

        return {
            relativeToAssetDirectory,
            absolute: path.join(config.guestPaths.asset, relativeToAssetDirectory),
        };
    }

}
