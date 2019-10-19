import { SimpleCommand } from '../../executor/simple-command';

export class PrepareProxyDomainCommand extends SimpleCommand {
    constructor(readonly instanceHash: string, readonly portId: string) {
        super();
    }
}
