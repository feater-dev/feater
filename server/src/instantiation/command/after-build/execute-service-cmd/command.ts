import {EnvVariablesSet} from '../../../sets/env-variables-set';
import {SimpleCommand} from '../../../executor/simple-command';
import {InheritedEnvVariableInterface} from '../inherited-env-variable.interface';

export class ExecuteServiceCmdCommand extends SimpleCommand {

    constructor(
        readonly collectedEnvVariables: EnvVariablesSet,
        readonly customEnvVariables: EnvVariablesSet,
        readonly inheritedEnvVariables: InheritedEnvVariableInterface[],
        readonly containerId: string,
        readonly executable: string[],
        readonly absoluteGuestInstancePath: string,
    ) {
        super();
    }

}
