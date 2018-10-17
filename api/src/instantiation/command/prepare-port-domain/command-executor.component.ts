import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {environment} from '../../../environment/environment';
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

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as PrepareProxyDomainCommand;

        return new Promise<any>((resolve, reject) => {
            const proxyDomain = `instance-${typedCommand.instanceHash}-${typedCommand.portId}.${environment.app.host}`;

            const envVariables = new EnvVariablesSet();
            envVariables.add(`FEAT__PROXY_DOMAIN__${typedCommand.portId.toUpperCase()}`, proxyDomain);

            const featerVariables = new FeaterVariablesSet();
            featerVariables.add(`proxy_domain__${typedCommand.portId}`, proxyDomain);

            resolve({
                proxyDomain,
                envVariables,
                featerVariables,
            } as PrepareProxyDomainCommandResultInterface);
        });
    }
}
