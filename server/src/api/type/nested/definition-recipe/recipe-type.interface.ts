import {SourceTypeInterface} from './source-type.interface';
import {ProxiedPortTypeInterface} from './proxied-port-type.interface';
import {SummaryItemTypeInterface} from './summary-item-type.interface';
import {ComposeFileTypeInterface} from './compose-file-type.interface';
import {EnvVariableTypeInterface} from './env-variable-type.interface';
import {SourceVolumeTypeInterface} from './source-volume-type.interface';
import {AssetVolumeTypeInterface} from './asset-volume-type.interface';
import {AfterBuildTaskTypeInterface} from './after-build-task-type.interface';

export interface RecipeTypeInterface { // TODO Preserve, although not needed for API anymore. Move to instantiation module.
    readonly sources: SourceTypeInterface[];
    readonly sourceVolumes: SourceVolumeTypeInterface[];
    readonly assetVolumes: AssetVolumeTypeInterface[];
    readonly envVariables: EnvVariableTypeInterface[];
    readonly composeFiles: ComposeFileTypeInterface[];
    readonly proxiedPorts: ProxiedPortTypeInterface[];
    readonly afterBuildTasks: AfterBuildTaskTypeInterface[];
    readonly summaryItems: SummaryItemTypeInterface[];
}
