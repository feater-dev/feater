import {SimpleCommand} from '../../executor/simple-command';

export class ConnectToNetworkCommand extends SimpleCommand {

    constructor(
        readonly serviceId: string,
        readonly containerId: string,
    ) {
        super();
    }
}
