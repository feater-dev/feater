import { SourcePathsInterface } from '../helper/source-paths.interface';
import { InstanceContextBeforeBuildTaskInterface } from './before-build/instance-context-before-build-task.interface';

export interface InstanceContextSourceInterface {
    id: string;
    cloneUrl: string;
    useDeployKey: boolean;
    reference: {
        type: string;
        name: string;
    };
    paths: SourcePathsInterface;
    dockerVolumeName?: string;
    beforeBuildTasks: InstanceContextBeforeBuildTaskInterface[];
}
