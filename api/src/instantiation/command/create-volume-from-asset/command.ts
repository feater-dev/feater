import {SimpleCommand} from '../../executor/simple-command';

export class CreateVolumeFromAssetCommand extends SimpleCommand {

    constructor(
        readonly volumeId: string,
        readonly assetId: string,
        readonly containerNamePrefix: string,
        readonly absoluteGuestInstanceDirPath: string,
    ) {
        super();
    }

}
