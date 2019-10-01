import { SimpleCommand } from '../../executor/simple-command';

export class CreateSourceVolumeCommand extends SimpleCommand {
    constructor(
        readonly sourceDockerVolumeName: string,
        readonly sourceId: string,
        readonly sourceAbsoluteGuestPath: string,
        readonly workingDirectory: string,
        readonly sourceVolumeRelativePath?: string,
        readonly sourceVolumeId?: string,
    ) {
        super();
    }
}
