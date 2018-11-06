import {Injectable} from '@nestjs/common';
import {AssetInterface} from '../../persistence/interface/asset.interface';
import * as path from 'path';
import {environment} from '../../environments/environment';
import {AssetRepository} from '../../persistence/repository/asset.repository';

export interface AssetUploadPathsInterface {
    readonly relativeToAssetPath: string;
    readonly absolute: {
        readonly guest: string;
        readonly host: string;
    };
}

@Injectable()
export class AssetHelper {

    constructor(private readonly assetRepository: AssetRepository) {}

    async findUploadedById(id: string): Promise<AssetInterface> {
        const assets = await this.assetRepository.find({id, uploaded: true}, 0, 1);
        if (0 === assets.length) {
            throw new Error(`No assets with id '${id}' found.`);
        }
        if (assets.length > 1) {
            throw new Error(`Multiple assets with id '${id}' found.`);
        }

        return assets[0];
    }

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
