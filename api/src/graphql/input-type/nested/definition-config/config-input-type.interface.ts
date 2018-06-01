import {ComposeFileInputTypeInterface} from './compose-file-input-type.interface';
import {SummaryItemInputTypeInterface} from './summary-item-input-type.interface';
import {ProxiedPortInputTypeInterface} from './proxied-port-input-type.interface';
import {SourceInputTypeInterface} from './source-type.interface';
import {EnvironmentalVariableInputTypeInterface} from './environmental-variable-input-type.interface';

export interface ConfigInputTypeInterface {
    readonly sources: SourceInputTypeInterface[];
    readonly proxiedPorts: ProxiedPortInputTypeInterface[];
    readonly summaryItems: SummaryItemInputTypeInterface[];
    readonly environmentalVariables: EnvironmentalVariableInputTypeInterface[];
    readonly composeFiles: ComposeFileInputTypeInterface[];
}
