import {SourceTypeInterface} from './source-type.interface';
import {ProxiedPortTypeInterface} from './proxied-port-type.interface';
import {SummaryItemTypeInterface} from './summary-item-type.interface';
import {ComposeFileTypeInterface} from './compose-file-type.interface';
import {EnvironmentalVariableTypeInterface} from './environmental-variable-type.interface';

export interface ConfigTypeInterface {
    readonly sources: SourceTypeInterface[];
    readonly proxiedPorts: ProxiedPortTypeInterface[];
    readonly summaryItems: SummaryItemTypeInterface[];
    readonly environmentalVariables: EnvironmentalVariableTypeInterface[];
    readonly composeFiles: ComposeFileTypeInterface[];
}
