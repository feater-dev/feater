import {AbsolutePathsInterface} from '../helper/absolute-paths.interface';
import {InstanceContextBeforeBuildTaskInterface} from './before-build/instance-context-before-build-task.interface';

export interface InstanceContextSourceInterface {
    id: string;
    cloneUrl: string;
    reference: {
        type: string;
        name: string;
    };
    paths: {
        dir: AbsolutePathsInterface,
    };
    volume: {
        name: string;
    };
    beforeBuildTasks: InstanceContextBeforeBuildTaskInterface[];
}
