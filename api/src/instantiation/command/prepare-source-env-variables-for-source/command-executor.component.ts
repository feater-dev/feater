import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {PrepareEnvVariablesForSourceCommand} from './command';
import {PrepareEnvVariablesForSourceCommandResultInterface} from './command-result.interface';

@Injectable()
export class PrepareEnvVariablesForSourceCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof PrepareEnvVariablesForSourceCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        // TODO Maybe replace this with volumes?

        const typedCommand = command as PrepareEnvVariablesForSourceCommand;

        return new Promise<any>(resolve => {
            const envVariables = new EnvVariablesSet();
            envVariables.add(
                `FEAT__BUILD_PATH__${typedCommand.sourceId.toUpperCase()}`, // TODO Rename to FEATER__GUEST_PATH__
                typedCommand.sourceAbsoluteGuestPath,
            );
            envVariables.add(
                `FEAT__VOLUME_PATH__${typedCommand.sourceId.toUpperCase()}`, // TODO Rename to FEATER__HOST_PATH__
                typedCommand.sourceAbsoluteHostPath,
            );

            resolve({envVariables} as PrepareEnvVariablesForSourceCommandResultInterface);
        });
    }

}
