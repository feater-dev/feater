import {SimpleCommand} from '../../executor/simple-command';

export class MoveSourceToVolumeCommand extends SimpleCommand {

    readonly NAME = 'move_source_to_volume';

    constructor(
        readonly absoluteGuestSourceDirPath: string,
        readonly absoluteHostSourceDirPath: string,
        readonly volumeName: string,
        readonly removeSource: boolean,
    ) {
        super();
    }

}
