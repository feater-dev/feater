import {EnvVariablesSet} from '../../sets/env-variables-set';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';

export interface CloneSourceCommandResultInterface {
    dockerVolumeName: string;
    envVariables: EnvVariablesSet;
    featerVariables: FeaterVariablesSet;
}
