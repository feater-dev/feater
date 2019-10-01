import { SimpleCommand } from '../../executor/simple-command';

export class EnableProxyDomainsCommand extends SimpleCommand {
    constructor(
        readonly instanceHash: string,
        readonly nginxConfigs: string[],
    ) {
        super();
    }
}
