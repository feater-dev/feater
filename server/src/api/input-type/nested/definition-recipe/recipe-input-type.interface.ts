import {ComposeFileInputTypeInterface} from './compose-file-input-type.interface';
import {SummaryItemInputTypeInterface} from './summary-item-input-type.interface';
import {ProxiedPortInputTypeInterface} from './proxied-port-input-type.interface';
import {SourceInputTypeInterface} from './source-type.interface';
import {EnvVariableInputTypeInterface} from './env-variable-input-type.interface';

export interface RecipeInputTypeInterface {
    sources: SourceInputTypeInterface[];
    proxiedPorts: ProxiedPortInputTypeInterface[];
    summaryItems: SummaryItemInputTypeInterface[];
    envVariables: EnvVariableInputTypeInterface[];
    composeFiles: ComposeFileInputTypeInterface[];
}
