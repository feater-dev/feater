import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {PrepareEnvVarsForSourceCommand} from './command';
import {PrepareEnvVarsForSourceCommandResultInterface} from './command-result.interface';

@Injectable()
export class PrepareEnvVariablesForSourceCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof PrepareEnvVarsForSourceCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        // TODO Maybe replace this with volumes?

        const typedCommand = command as PrepareEnvVarsForSourceCommand;

        return new Promise<any>(resolve => {
            const envVariables = new EnvVariablesSet();
            envVariables.add(
                `FEATER__GUEST_SOURCE_PATH__${typedCommand.sourceId.toUpperCase()}`,
                typedCommand.sourceAbsoluteGuestPath,
            );
            envVariables.add(
                `FEATER__HOST_SOURCE_PATH__${typedCommand.sourceId.toUpperCase()}`,
                typedCommand.sourceAbsoluteHostPath,
            );

            resolve({envVariables} as PrepareEnvVarsForSourceCommandResultInterface);
        });
    }

}
