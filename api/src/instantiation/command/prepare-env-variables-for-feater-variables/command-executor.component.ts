import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {PrepareEnvVariablesForFeaterVariablesCommand} from './command';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {PrepareEnvVariablesForFeaterVariablesCommandResultInterface} from './command-result.interface';

@Injectable()
export class PrepareEnvVariablesForFeaterVariablesCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof PrepareEnvVariablesForFeaterVariablesCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as PrepareEnvVariablesForFeaterVariablesCommand;

        return new Promise<any>(resolve => {
            const envVariables = new EnvVariablesSet();
            for (const featerVariable of typedCommand.featerVariables.toList()) {
                envVariables.add(`FEATER__${featerVariable.name.toUpperCase()}`, featerVariable.value);
            }

            resolve({envVariables} as PrepareEnvVariablesForFeaterVariablesCommandResultInterface);
        });
    }
}
