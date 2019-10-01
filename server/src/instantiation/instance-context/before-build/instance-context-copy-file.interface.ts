import { InstanceContextBeforeBuildTaskInterface } from './instance-context-before-build-task.interface';

export interface InstanceContextCopyFileInterface
    extends InstanceContextBeforeBuildTaskInterface {
    readonly type: string;
    readonly sourceRelativePath: string;
    readonly destinationRelativePath: string;
}
