import { EnvVariablesSet } from '../../sets/env-variables-set';
import { FeaterVariablesSet } from '../../sets/feater-variables-set';

export interface CloneSourceCommandResultInterface {
    readonly envVariables: EnvVariablesSet;
    readonly featerVariables: FeaterVariablesSet;
}
