import { ActionExecutionContextAfterBuildTaskInterface } from './action-execution-context-after-build-task.interface';

export interface ActionExecutionContextCopyAssetIntoContainerInterface
    extends ActionExecutionContextAfterBuildTaskInterface {
    readonly assetId: string;
    readonly serviceId: string;
    readonly destinationPath: string;
}
