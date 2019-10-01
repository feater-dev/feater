import { SimpleCommand } from '../../executor/simple-command';

export class RemoveVolumeCommand extends SimpleCommand {
    constructor(
        readonly dockerVolumeName: string,
        readonly workingDirectory: string,
    ) {
        super();
    }
}
