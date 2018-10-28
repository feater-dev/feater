import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {ConfigureProxyDomainCommand} from './command';

@Injectable()
export class ConfigureProxyDomainCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof ConfigureProxyDomainCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as ConfigureProxyDomainCommand;

        return new Promise<any>(resolve => {
            const nginxConfig =
`
# Proxy domain for
# port ${typedCommand.port}
# of ${typedCommand.serviceId}
# running at IP address ${typedCommand.ipAddress}
#
server {
    listen 80;
    server_name ${typedCommand.proxyDomain};

    location / {
        proxy_pass http://${typedCommand.ipAddress}:${typedCommand.port};
        proxy_set_header Host $host:80;
    }
}
`;
            resolve({nginxConfig});
        });
    }
}
