import * as path from 'path';
import {environment} from '../../environment/environment';
import {Injectable} from '@nestjs/common';
import {AbsolutePathsInterface} from './absolute-paths.interface';

@Injectable()
export class PathHelper {

    getInstancePaths(instanceHash: string): AbsolutePathsInterface {
        const relative = path.join(instanceHash);

        return {
            absolute: {
                guest: path.join(environment.guestPaths.build, relative),
                host: path.join(environment.hostPaths.build, relative),
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
                guest: path.join(environment.guestPaths.asset, relative),
                host: path.join(environment.hostPaths.asset, relative),
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
