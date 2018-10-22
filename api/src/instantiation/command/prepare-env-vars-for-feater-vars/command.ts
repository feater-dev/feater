import {SimpleCommand} from '../../executor/simple-command';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';

export class PrepareEnvVarsForFeaterVarsCommand extends SimpleCommand {

    constructor(
        readonly featerVariables: FeaterVariablesSet,
    ) {
        super();
    }

}
