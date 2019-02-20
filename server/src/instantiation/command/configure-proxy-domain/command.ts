import {SimpleCommand} from '../../executor/simple-command';

export class ConfigureProxyDomainCommand extends SimpleCommand {

    constructor(
        readonly serviceId: string,
        readonly ipAddress: string,
        readonly port: number,
        readonly proxyDomain: string,
    ) {
        super();
    }

}
