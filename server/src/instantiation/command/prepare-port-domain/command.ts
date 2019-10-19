import { SimpleCommand } from '../../executor/simple-command';

export class PrepareProxyDomainCommand extends SimpleCommand {
    constructor(readonly instanceHash: unknown, readonly portId: string) {
        super();
    }
}
