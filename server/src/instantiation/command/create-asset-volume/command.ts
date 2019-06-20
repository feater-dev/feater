import {SimpleCommand} from '../../executor/simple-command';

export class CreateAssetVolumeCommand extends SimpleCommand {

    constructor(
        readonly assetVolumeId: string,
        readonly assetDockerVolumeName: string,
        readonly absoluteGuestInstanceDirPath: string,
        readonly assetId?: string,
    ) {
        super();
    }

}
