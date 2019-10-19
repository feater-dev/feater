import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { SimpleCommand } from '../../executor/simple-command';
import { ConfigureProxyDomainCommand } from './command';
import { InterpolationHelper } from '../../helper/interpolation-helper.component';
import { FeaterVariablesSet } from '../../sets/feater-variables-set';

const defaultNginxConfigTemplate = `# Proxy domain for
# port {{{port}}}
# of {{{service_id}}}
# running at IP address {{{ip_address}}}
#
server {
    listen 9011;
    listen [::]:9011;

    server_name {{{proxy_domain}}};

    location / {
        proxy_pass http://{{{ip_address}}}:{{{port}}};
        proxy_set_header Host $host;
    }
}`;

@Injectable()
export class ConfigureProxyDomainCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    constructor(private readonly interpolationHelper: InterpolationHelper) {}

    supports(command: SimpleCommand): boolean {
        return command instanceof ConfigureProxyDomainCommand;
    }

    async execute(command: SimpleCommand): Promise<unknown> {
        const {
            serviceId,
            ipAddress,
            port,
            proxyDomain,
            nginxConfigTemplate,
            commandLogger,
        } = command as ConfigureProxyDomainCommand;

        commandLogger.info(`Port: ${port}`);
        commandLogger.info(`Service ID: ${serviceId}`);
        commandLogger.info(`IP address: ${ipAddress}`);
        commandLogger.info(`Proxy domain: ${proxyDomain}`);
        commandLogger.info(
            nginxConfigTemplate
                ? `Using custom configuration template.`
                : `Using deafult configuration template.`,
        );

        const interpolatedTokens = new FeaterVariablesSet();
        interpolatedTokens.add('proxy_domain', proxyDomain);
        interpolatedTokens.add('service_id', serviceId);
        interpolatedTokens.add('ip_address', ipAddress);
        interpolatedTokens.add('port', String(port));

        const nginxConfig = this.interpolationHelper.interpolateText(
            nginxConfigTemplate || defaultNginxConfigTemplate,
            interpolatedTokens,
        );

        commandLogger.info(`Nginx configuration:\n${nginxConfig}`);

        return { nginxConfig };
    }
}
