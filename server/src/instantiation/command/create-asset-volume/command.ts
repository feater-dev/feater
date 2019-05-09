import {SimpleCommand} from '../../executor/simple-command';

export class CreateAssetVolumeCommand extends SimpleCommand {

    constructor(
        readonly volumeId: string,
        readonly containerNamePrefix: string,
        readonly absoluteGuestInstanceDirPath: string,
        readonly assetId?: string,
    ) {
        super();
    }

}
