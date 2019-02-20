import * as path from 'path';
import {config} from '../../config/config';
import {Injectable} from '@nestjs/common';
import {SourcePathsInterface} from './source-paths.interface';

@Injectable()
export class PathHelper {

    getInstancePaths(instanceHash: string): SourcePathsInterface {
        const relative = path.join(instanceHash);

        return {
            absolute: {
                guest: path.join(config.guestPaths.build, relative),
                host: path.join(config.hostPaths.build, relative), // TODO Remove.
            },
        };
    }

    getSourcePaths(instanceHash: string, sourceId: string): SourcePathsInterface {
        const instancePaths = this.getInstancePaths(instanceHash);
        const relative = path.join('source', sourceId);

        return {
            absolute: {
                guest: path.join(instancePaths.absolute.guest, relative),
                host: path.join(instancePaths.absolute.host, relative), // TODO Remove.
            },
        };
    }

}
