import {AbsolutePathsInterface} from '../helper/absolute-paths.interface';
import {InstanceContextBeforeBuildTaskInterface} from './before-build/instance-context-before-build-task.interface';

export interface InstanceContextSourceInterface {
    readonly id: string;
    readonly sshCloneUrl: string;
    readonly reference: {
        readonly type: string;
        readonly name: string;
    };
    readonly paths: {
        readonly dir: AbsolutePathsInterface,
    };
    readonly beforeBuildTasks: InstanceContextBeforeBuildTaskInterface[];
}
