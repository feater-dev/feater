import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { config } from '../../../config/config';
import { SimpleCommand } from '../../executor/simple-command';
import { EnvVariablesSet } from '../../sets/env-variables-set';
import { FeaterVariablesSet } from '../../sets/feater-variables-set';
import { PrepareProxyDomainCommand } from './command';
import { PrepareProxyDomainCommandResultInterface } from './command-result.interface';

@Injectable()
export class PrepareProxyDomainCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    supports(command: SimpleCommand): boolean {
        return command instanceof PrepareProxyDomainCommand;
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            instanceHash,
            portId,
            commandLogger,
        } = command as PrepareProxyDomainCommand;

        const proxyDomain = config.instantiation.proxyDomainPattern
            .replace('{instance_hash}', instanceHash)
            .replace('{port_id}', portId);
        commandLogger.info(`Proxy domain: ${proxyDomain}`);

        const envVariables = new EnvVariablesSet();
        envVariables.add(
            `FEATER__PROXY_DOMAIN__${portId.toUpperCase()}`,
            proxyDomain,
        );
        commandLogger.infoWithEnvVariables(envVariables);

        const featerVariables = new FeaterVariablesSet();
        featerVariables.add(`proxy_domain__${portId}`, proxyDomain);
        commandLogger.infoWithFeaterVariables(featerVariables);

        return {
            proxyDomain,
            envVariables,
            featerVariables,
        } as PrepareProxyDomainCommandResultInterface;
    }
}
