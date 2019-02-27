import {SimpleCommand} from '../../executor/simple-command';

export class PrepareProxyDomainCommand extends SimpleCommand {

    constructor(
        readonly instanceHash: any,
        readonly portId: string,
    ) {
        super();
    }

}
