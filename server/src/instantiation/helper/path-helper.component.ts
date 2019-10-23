import * as path from 'path';
import { config } from '../../config/config';
import { Injectable } from '@nestjs/common';

export interface InstancePathsInterface {
    readonly absolute: {
        readonly guest: string;
        readonly host: string;
    };
}

export interface SourcePathsInterface {
    readonly absolute: {
        readonly guest: string;
        readonly host: string;
    };
}

export interface CommandLogPathsInterface {
    readonly absolute: {
        readonly guest: string;
    };
}

@Injectable()
export class PathHelper {
    getInstancePaths(instanceHash: string): InstancePathsInterface {
        const relative = path.join(instanceHash);

        return {
            absolute: {
                guest: path.join(config.guestPaths.build, relative),
                host: path.join(config.hostPaths.build, relative),
            },
        };
    }

    getSourcePaths(
        instanceHash: string,
        sourceId: string,
    ): SourcePathsInterface {
        const instancePaths = this.getInstancePaths(instanceHash);
        const relative = path.join('source', sourceId);

        return {
            absolute: {
                guest: path.join(instancePaths.absolute.guest, relative),
                host: path.join(instancePaths.absolute.host, relative),
            },
        };
    }

    getCommandLogPaths(
        instanceHash: string,
        commandLogId: string,
    ): CommandLogPathsInterface {
        const instancePaths = this.getInstancePaths(instanceHash);
        const relative = path.join('commandlog', commandLogId);

        return {
            absolute: {
                guest: path.join(instancePaths.absolute.guest, relative),
            },
        };
    }
}
