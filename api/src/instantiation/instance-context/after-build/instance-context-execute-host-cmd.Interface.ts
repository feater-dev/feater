import {InstanceContextAfterBuildTaskInterface} from './instance-context-after-build-task.interface';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {InheritedEnvVariableInterface} from '../../command/after-build/inherited-env-variable.interface';
import {CustomEnvVariableInterface} from '../../command/after-build/custom-env-variable.interface';

export interface InstanceContextExecuteHostCmdInterface extends InstanceContextAfterBuildTaskInterface {
    readonly customEnvVariables: CustomEnvVariableInterface[];
    readonly inheritedEnvVariables: InheritedEnvVariableInterface[];
    readonly command: string[];
    readonly absoluteGuestInstancePath: string;
}
