import {SimpleCommand} from '../../executor/simple-command';

export class ConnectToNetworkCommand extends SimpleCommand {

    readonly NAME = 'clone_source';

    constructor(
        readonly serviceId: string,
        readonly containerId: string,
    ) {
        super();
    }
}
