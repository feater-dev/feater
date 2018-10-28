import {AbsolutePathsInterface} from '../helper/absolute-paths.interface';

export interface InstanceContextVolumeInterface {
    readonly id: string;
    readonly assetId: string;
    readonly paths: {
        readonly extractDir: AbsolutePathsInterface;
    };
}
