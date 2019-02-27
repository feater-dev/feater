import {SimpleCommand} from '../../executor/simple-command';
import {EnvVariablesSet} from '../../sets/env-variables-set';

export class CollectEnvVariablesCommand extends SimpleCommand {

    constructor(
        readonly envVariables: EnvVariablesSet,
        readonly envVariablesForFeaterVariables: EnvVariablesSet,
        readonly envVariablesForSources: EnvVariablesSet[],
    ) {
        super();
    }

}
