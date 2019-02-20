import {SourcePathsInterface} from '../helper/source-paths.interface';

export interface InstanceContextVolumeInterface {
    id: string;
    assetId: string;
    dockerVolumeName?: string;
}
