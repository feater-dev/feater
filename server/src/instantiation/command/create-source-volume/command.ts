import {SimpleCommand} from '../../executor/simple-command';

export class CreateSourceVolumeCommand extends SimpleCommand {

    constructor(
        readonly sourceId: string,
        readonly sourceDockerVolumeName: string,
        readonly sourceAbsoluteGuestPath: string,
        readonly workingDirectory: string,
    ) {
        super();
    }

}
