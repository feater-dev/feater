import {SimpleCommand} from '../../executor/simple-command';

export class PrepareEnvVarsForSourceCommand extends SimpleCommand {

    constructor(
        readonly sourceId: string,
        readonly sourceAbsoluteGuestPath: string,
        readonly sourceAbsoluteHostPath: string,
    ) {
        super();
    }

}
