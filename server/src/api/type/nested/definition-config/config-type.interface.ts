import {SourceTypeInterface} from './source-type.interface';
import {ProxiedPortTypeInterface} from './proxied-port-type.interface';
import {SummaryItemTypeInterface} from './summary-item-type.interface';
import {ComposeFileTypeInterface} from './compose-file-type.interface';
import {EnvVariableTypeInterface} from './env-variable-type.interface';

export interface ConfigTypeInterface {
    readonly sources: SourceTypeInterface[];
    readonly proxiedPorts: ProxiedPortTypeInterface[];
    readonly summaryItems: SummaryItemTypeInterface[];
    readonly envVariables: EnvVariableTypeInterface[];
    readonly composeFiles: ComposeFileTypeInterface[];
}
