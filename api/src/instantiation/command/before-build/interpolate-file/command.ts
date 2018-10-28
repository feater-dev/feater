import {FeaterVariablesSet} from '../../../sets/feater-variables-set';
import {SimpleCommand} from '../../../executor/simple-command';

export class InterpolateFileCommand extends SimpleCommand {

    constructor(
        readonly featerVariables: FeaterVariablesSet,
        readonly absoluteGuestPath: string,
    ) {
        super();
    }

}
