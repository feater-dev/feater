import {EnvVariablesSet} from '../../sets/env-variables-set';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';

export interface PrepareSourceEnvVarsCommandResultInterface {
    envVariables: EnvVariablesSet;
    featerVariables: FeaterVariablesSet;
}
