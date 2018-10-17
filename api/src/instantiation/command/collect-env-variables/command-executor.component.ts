import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {CollectEnvVariablesCommand} from './collectEnvVariablesCommand';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {CollectEnvVariablesCommandResultInterface} from './command-result.interface';

@Injectable()
export class CollectEnvVariablesCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof CollectEnvVariablesCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as CollectEnvVariablesCommand;

        return new Promise<any>(resolve => {
            const envVariablesToCollect: EnvVariablesSet[] = [typedCommand.envVariables]
                .concat(
                    typedCommand.envVariablesForFeaterVariables,
                    ...typedCommand.envVariablesForSources,
                );
            const envVariables = EnvVariablesSet.merge(...envVariablesToCollect);

            resolve({envVariables} as CollectEnvVariablesCommandResultInterface);
        });
    }
}
