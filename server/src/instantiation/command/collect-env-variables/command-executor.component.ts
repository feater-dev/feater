import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { SimpleCommand } from '../../executor/simple-command';
import { CollectEnvVariablesCommand } from './collectEnvVariablesCommand';
import { EnvVariablesSet } from '../../sets/env-variables-set';
import { CollectEnvVariablesCommandResultInterface } from './command-result.interface';

@Injectable()
export class CollectEnvVariablesCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    supports(command: SimpleCommand): boolean {
        return command instanceof CollectEnvVariablesCommand;
    }

    execute(command: SimpleCommand): Promise<any> {
        const {
            envVariables,
            envVariablesForFeaterVariables,
            envVariablesForSources,
            commandLogger,
        } = command as CollectEnvVariablesCommand;

        return new Promise<any>(resolve => {
            const envVariablesToCollect: EnvVariablesSet[] = [
                envVariables,
            ].concat(envVariablesForFeaterVariables, ...envVariablesForSources);
            let collectedEnvVariables = EnvVariablesSet.merge(
                ...envVariablesToCollect,
            );

            resolve({
                envVariables: collectedEnvVariables,
            } as CollectEnvVariablesCommandResultInterface);
        });
    }
}
