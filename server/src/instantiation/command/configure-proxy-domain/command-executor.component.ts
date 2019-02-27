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
        const typedCommand = command as ConfigureProxyDomainCommand;
        const commandLogger = typedCommand.commandLogger;

        commandLogger.info(`Port: ${typedCommand.port}`);
        commandLogger.info(`Service ID: ${typedCommand.serviceId}`);
        commandLogger.info(`IP address: ${typedCommand.ipAddress}`);
        commandLogger.info(`Proxy domain: ${typedCommand.proxyDomain}`);

        const nginxConfig =
`
# Proxy domain for
# port ${typedCommand.port}
# of ${typedCommand.serviceId}
# running at IP address ${typedCommand.ipAddress}
#
server {
    listen 9011;
    listen [::]:9011;

    server_name ${typedCommand.proxyDomain};

    location / {
        proxy_pass http://${typedCommand.ipAddress}:${typedCommand.port};
        proxy_set_header Host $host;
    }
}
`;

        commandLogger.info(`Nginx configuration:\n${nginxConfig}`);

        return {nginxConfig};
    }

}
