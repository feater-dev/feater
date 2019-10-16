import { ActionExecutionContextBeforeBuildTaskInterface } from './action-execution-context-before-build-task.interface';

export interface ActionExecutionContextCopyFileInterface
    extends ActionExecutionContextBeforeBuildTaskInterface {
    readonly type: string;
    readonly sourceRelativePath: string;
    readonly destinationRelativePath: string;
}
