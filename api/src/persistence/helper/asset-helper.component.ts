import {Injectable} from '@nestjs/common';
import {AssetInterface} from '../interface/asset.interface';
import * as path from 'path';
import {environment} from '../../environments/environment';
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
                guest: path.join(environment.guestPaths.asset, relativeToAssetPath),
                host: path.join(environment.hostPaths.asset, relativeToAssetPath),
            },
        };
    }

}
