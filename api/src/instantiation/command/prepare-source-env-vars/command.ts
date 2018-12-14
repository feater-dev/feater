import {SimpleCommand} from '../../executor/simple-command';

export class PrepareSourceEnvVarsCommand extends SimpleCommand {

    constructor(
        readonly sourceId: string,
        readonly sourceAbsoluteGuestPath: string,
        readonly sourceAbsoluteHostPath: string,
        readonly sourceVolumeName: string,
    ) {
        super();
    }

}
