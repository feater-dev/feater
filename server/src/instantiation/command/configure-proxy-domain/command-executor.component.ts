import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {ConfigureProxyDomainCommand} from './command';

@Injectable()
export class ConfigureProxyDomainCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof ConfigureProxyDomainCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            serviceId,
            ipAddress,
            port,
            proxyDomain,
            commandLogger,
        } = command as ConfigureProxyDomainCommand;

        commandLogger.info(`Port: ${port}`);
        commandLogger.info(`Service ID: ${serviceId}`);
        commandLogger.info(`IP address: ${ipAddress}`);
        commandLogger.info(`Proxy domain: ${proxyDomain}`);

        const nginxConfig =
`
# Proxy domain for
# port ${port}
# of ${serviceId}
# running at IP address ${ipAddress}
#
server {
    listen 9011;
    listen [::]:9011;

    server_name ${proxyDomain};

    location / {
        proxy_pass http://${ipAddress}:${port};
        proxy_set_header Host $host;
    }
}
`;

        commandLogger.info(`Nginx configuration:\n${nginxConfig}`);

        return {nginxConfig};
    }

}
