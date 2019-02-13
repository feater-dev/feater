import * as path from 'path';
import {config} from '../../config/config';
import {Injectable} from '@nestjs/common';
import {AbsolutePathsInterface} from './absolute-paths.interface';

@Injectable()
export class PathHelper {

    getInstancePaths(instanceHash: string): AbsolutePathsInterface {
        const relative = path.join(instanceHash);

        return {
            absolute: {
                guest: path.join(config.guestPaths.build, relative),
                host: path.join(config.hostPaths.build, relative),
            },
        };
    }

    getSourcePaths(instanceHash: string, sourceId: string): AbsolutePathsInterface {
        const instancePaths = this.getInstancePaths(instanceHash);
        const relative = path.join('source', sourceId);

        return {
            absolute: {
                guest: path.join(instancePaths.absolute.guest, relative),
                host: path.join(instancePaths.absolute.host, relative),
            },
        };
    }

    getAssetUploadPaths(assetId: string, projectId: string): AbsolutePathsInterface {
        const relative = path.join(projectId, 'asset', assetId);

        return {
            absolute: {
                guest: path.join(config.guestPaths.asset, relative),
                host: path.join(config.hostPaths.asset, relative),
            },
        };
    }

    getAssetExtractPaths(instanceHash: string, assetId: string): AbsolutePathsInterface {
        const instancePaths = this.getInstancePaths(instanceHash);
        const relative = path.join('asset', assetId);

        return {
            absolute: {
                guest: path.join(instancePaths.absolute.guest, relative),
                host: path.join(instancePaths.absolute.host, relative),
            },
        };
    }

}
