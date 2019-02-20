import {SimpleCommand} from '../../executor/simple-command';

export class CreateVolumeFromSourceCommand extends SimpleCommand {

    constructor(
        readonly sourceId: string,
        readonly sourceDockerVolumeName: string,
        readonly sourceAbsoluteGuestPath: string,
        readonly workingDirectory: string,
    ) {
        super();
    }

}
