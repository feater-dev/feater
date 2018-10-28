import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {PrepareSourceEnvVarsCommand} from './command';
import {PrepareSourceEnvVarsCommandResultInterface} from './command-result.interface';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';

@Injectable()
export class PrepareSourceEnvVarsCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof PrepareSourceEnvVarsCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        // TODO Maybe replace this with volumes?

        const typedCommand = command as PrepareSourceEnvVarsCommand;

        return new Promise<any>(resolve => {
            const envVariables = new EnvVariablesSet();
            const featerVariables = new FeaterVariablesSet();
            envVariables.add(
                `FEATER__GUEST_SOURCE_PATH__${typedCommand.sourceId.toUpperCase()}`,
                typedCommand.sourceAbsoluteGuestPath,
            );
            featerVariables.add(
                `guest_source_path__${typedCommand.sourceId.toLowerCase()}`,
                typedCommand.sourceAbsoluteGuestPath,
            );
            envVariables.add(
                `FEATER__HOST_SOURCE_PATH__${typedCommand.sourceId.toUpperCase()}`,
                typedCommand.sourceAbsoluteHostPath,
            );
            featerVariables.add(
                `host_source_path__${typedCommand.sourceId.toLowerCase()}`,
                typedCommand.sourceAbsoluteHostPath,
            );

            resolve({envVariables, featerVariables} as PrepareSourceEnvVarsCommandResultInterface);
        });
    }

}
