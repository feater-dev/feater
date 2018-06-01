import {SourceReferenceTypeInterface} from './source-reference-type.interface';
import {BeforeBuildTaskTypeInterface} from './before-build-task-type.interface';

export interface SourceTypeInterface {
    readonly id: string;
    readonly type: string;
    readonly name: string;
    readonly reference: SourceReferenceTypeInterface;
    readonly beforeBuildTasks: BeforeBuildTaskTypeInterface[];
}
