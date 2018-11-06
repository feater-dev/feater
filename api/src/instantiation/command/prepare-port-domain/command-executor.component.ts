import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {environment} from '../../../environments/environment';
import {SimpleCommand} from '../../executor/simple-command';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';
import {PrepareProxyDomainCommand} from './command';
import {PrepareProxyDomainCommandResultInterface} from './command-result.interface';

@Injectable()
export class PrepareProxyDomainCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof PrepareProxyDomainCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as PrepareProxyDomainCommand;
        const logger = typedCommand.commandLogger;

        const proxyDomain = environment.instantiation.proxyDomainPattern
            .replace('{instance_hash}', typedCommand.instanceHash)
            .replace('{port_id}', typedCommand.portId);

        const envVariables = new EnvVariablesSet();
        envVariables.add(`FEATER__PROXY_DOMAIN__${typedCommand.portId.toUpperCase()}`, proxyDomain);

        const featerVariables = new FeaterVariablesSet();
        featerVariables.add(`proxy_domain__${typedCommand.portId}`, proxyDomain);

        logger.info(`Proxy domain: ${proxyDomain}`);
        logger.info(`Added environmental variables:${
            envVariables.isEmpty()
                ? ' none'
                : '\n' + JSON.stringify(envVariables.toMap(), null, 2)
        }`);
        logger.info(`Added Feater variables:${
            featerVariables.isEmpty()
                ? ' none'
                : '\n' + JSON.stringify(featerVariables.toMap(), null, 2)
        }`);

        return {
            proxyDomain,
            envVariables,
            featerVariables,
        } as PrepareProxyDomainCommandResultInterface;
    }
}
