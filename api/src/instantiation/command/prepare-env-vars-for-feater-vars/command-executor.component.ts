import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {PrepareEnvVarsForFeaterVarsCommand} from './command';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {PrepareEnvVarsForFeaterVarsCommandResultInterface} from './command-result.interface';

@Injectable()
export class PrepareEnvVariablesForFeaterVariablesCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof PrepareEnvVarsForFeaterVarsCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as PrepareEnvVarsForFeaterVarsCommand;

        return new Promise<any>(resolve => {
            const envVariables = new EnvVariablesSet();
            for (const featerVariable of typedCommand.featerVariables.toList()) {
                envVariables.add(`FEATER__${featerVariable.name.toUpperCase()}`, featerVariable.value);
            }

            resolve({envVariables} as PrepareEnvVarsForFeaterVarsCommandResultInterface);
        });
    }
}
