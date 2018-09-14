import {Component} from '@nestjs/common';
import {AssetInterface} from '../persistence/interface/asset.interface';
import * as path from 'path';
import * as fs from 'fs';
import * as tar from 'tar';
import * as mkdirRecursive from 'mkdir-recursive';
import {environment} from '../environment/environment';
import {LoggerInterface} from '../logger/logger-interface';
import {JobLoggerFactory} from '../logger/job-logger-factory';
import {AssetRepository} from '../persistence/repository/asset.repository';
import {SpawnHelper} from './spawn-helper.component';

export interface AssetUploadPathsInterface {
    readonly relativeToAssetPath: string;
    readonly absolute: {
        readonly guest: string;
        readonly host: string;
    };
}

export interface AssetExtractPathsInterface {
    readonly relativeToBuildPath: string;
    readonly absolute: {
        readonly guest: string;
        readonly host: string;
    };
}

@Component()
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

    getExtractPaths(asset: AssetInterface, buildId: string, volumeId: string): AssetExtractPathsInterface {
        const relativeToBuildPath = path.join(buildId, volumeId, asset.id);

        return {
            relativeToBuildPath,
            absolute: {
                guest: path.join(environment.guestPaths.build, relativeToBuildPath),
                host: path.join(environment.hostPaths.build, relativeToBuildPath),
            },
        };
    }

}
