import {SourceReferenceInputTypeInterface} from './source-reference-input-type.interface';
import {BeforeBuildTaskInputTypeInterface} from './before-build-task-input-type.interface';

export interface SourceInputTypeInterface {
    readonly id: string;
    readonly type: string;
    readonly name: string;
    readonly reference: SourceReferenceInputTypeInterface;
    readonly beforeBuildTasks: BeforeBuildTaskInputTypeInterface[];
}
