import {BuildDefinitionSourceTypeInterface} from './build-definition-source-type.interface';
import {BuildDefinitionProxiedPortTypeInterface} from './build-definition-proxied-port-type.interface';
import {BuildDefinitionSummaryItemTypeInterface} from './build-definition-summary-item-type.interface';
import {BuildDefinitionComposeFileTypeInterface} from './build-definition-compose-file-type.interface';

export interface BuildDefinitionConfigTypeInterface {
    readonly sources: BuildDefinitionSourceTypeInterface[];
    readonly proxiedPorts: BuildDefinitionProxiedPortTypeInterface[];
    readonly summaryItems: BuildDefinitionSummaryItemTypeInterface[];
    readonly composeFiles: BuildDefinitionComposeFileTypeInterface[];
}
