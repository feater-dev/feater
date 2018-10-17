import {SimpleCommand} from '../../executor/simple-command';

export class PrepareEnvVariablesForSourceCommand extends SimpleCommand {

    constructor(
        readonly sourceId: string,
        readonly sourceAbsoluteGuestPath: string,
        readonly sourceAbsoluteHostPath: string,
    ) {
        super();
    }

}
