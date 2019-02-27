import {SimpleCommand} from '../../executor/simple-command';

export class RemoveSourceVolumeCommand extends SimpleCommand {

    constructor(
        readonly sourceId: string,
        readonly sourceDockerVolumeName: string,
        readonly workingDirectory: string,
    ) {
        super();
    }

}
