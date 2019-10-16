import { ActionExecutionContextBeforeBuildTaskInterface } from './action-execution-context-before-build-task.interface';

export interface ActionExecutionContextInterpolateFileInterface
    extends ActionExecutionContextBeforeBuildTaskInterface {
    readonly type: string;
    readonly relativePath: string;
    interpolatedText?: string;
}
