import { SimpleCommand } from '../../../executor/simple-command';

export class CopyAssetIntoContainerCommand extends SimpleCommand {
    constructor(
        readonly serviceId: string,
        readonly assetId: string,
        readonly destinationPath: string,
        readonly containerId: string,
        readonly absoluteGuestInstanceDirPath: string,
    ) {
        super();
    }
}
