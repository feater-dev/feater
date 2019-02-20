import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {config} from '../../../config/config';
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
        const commandLogger = typedCommand.commandLogger;

        const proxyDomain = config.instantiation.proxyDomainPattern
            .replace('{instance_hash}', typedCommand.instanceHash)
            .replace('{port_id}', typedCommand.portId);
        commandLogger.info(`Proxy domain: ${proxyDomain}`);

        const envVariables = new EnvVariablesSet();
        envVariables.add(`FEATER__PROXY_DOMAIN__${typedCommand.portId.toUpperCase()}`, proxyDomain);
        commandLogger.infoWithEnvVariables(envVariables);

        const featerVariables = new FeaterVariablesSet();
        featerVariables.add(`proxy_domain__${typedCommand.portId}`, proxyDomain);
        commandLogger.infoWithFeaterVariables(featerVariables);

        return {
            proxyDomain,
            envVariables,
            featerVariables,
        } as PrepareProxyDomainCommandResultInterface;
    }
}
