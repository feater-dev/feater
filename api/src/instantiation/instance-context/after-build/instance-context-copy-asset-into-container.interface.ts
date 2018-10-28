import {InstanceContextAfterBuildTaskInterface} from './instance-context-after-build-task.interface';

export interface InstanceContextCopyAssetIntoContainerInterface extends InstanceContextAfterBuildTaskInterface {
    readonly assetId: string;
    readonly serviceId: string;
    readonly destinationPath: string;
}
