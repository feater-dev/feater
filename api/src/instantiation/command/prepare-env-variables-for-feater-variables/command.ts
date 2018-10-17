import {SimpleCommand} from '../../executor/simple-command';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';

export class PrepareEnvVariablesForFeaterVariablesCommand extends SimpleCommand {

    constructor(
        readonly featerVariables: FeaterVariablesSet,
    ) {
        super();
    }

}
