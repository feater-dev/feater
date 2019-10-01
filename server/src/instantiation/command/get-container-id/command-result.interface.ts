import { EnvVariablesSet } from '../../sets/env-variables-set';
import { FeaterVariablesSet } from '../../sets/feater-variables-set';

export interface GetContainerIdsCommandResultServiceContainerIdInterface {
    readonly serviceId: string;
    readonly containerId: string;
}

export interface GetContainerIdsCommandResultInterface {
    readonly serviceContainerIds: GetContainerIdsCommandResultServiceContainerIdInterface[];
    readonly envVariables: EnvVariablesSet;
    readonly featerVariables: FeaterVariablesSet;
}
