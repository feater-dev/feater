import {Injectable} from '@nestjs/common';
import {AssetInterface} from '../interface/asset.interface';
import * as path from 'path';
import {config} from '../../config/config';
import {AssetRepository} from '../repository/asset.repository';

export interface AssetUploadPathsInterface {
    readonly relativeToAssetPath: string;
    readonly absolute: {
        readonly guest: string;
        readonly host: string;
    };
}

@Injectable()
export class AssetHelper {

    constructor() {}

    getUploadPaths(asset: AssetInterface): AssetUploadPathsInterface {
        const relativeToAssetPath = path.join(asset.projectId, asset.id);

        return {
            relativeToAssetPath,
            absolute: {
                guest: path.join(config.guestPaths.asset, relativeToAssetPath),
                host: path.join(config.hostPaths.asset, relativeToAssetPath),
            },
        };
    }

}
