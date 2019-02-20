import {InstanceContextBeforeBuildTaskInterface} from './instance-context-before-build-task.interface';

export interface InstanceContextInterpolateFileInterface extends InstanceContextBeforeBuildTaskInterface {
    readonly type: string;
    readonly relativePath: string;
    interpolatedText?: string;
}
