import {SourceReferenceInputTypeInterface} from './source-reference-input-type.interface';
import {BeforeBuildTaskInputTypeInterface} from './before-build-task-input-type.interface';

export interface SourceInputTypeInterface {
    id: string;
    name: string;
    reference: SourceReferenceInputTypeInterface;
    beforeBuildTasks: BeforeBuildTaskInputTypeInterface[];
}
