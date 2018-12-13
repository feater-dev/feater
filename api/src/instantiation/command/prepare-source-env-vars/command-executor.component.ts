import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
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

    async execute(command: SimpleCommand): Promise<any> {
        // TODO Maybe replace this with volumes?

        const typedCommand = command as PrepareSourceEnvVarsCommand;
        const logger = typedCommand.commandLogger;

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

        envVariables.add(
            `FEATER__SOURCE_VOLUME__${typedCommand.sourceId.toUpperCase()}`,
            typedCommand.sourceVolumeName,
        );
        featerVariables.add(
            `source_volume__${typedCommand.sourceId.toLowerCase()}`,
            typedCommand.sourceVolumeName,
        );

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

        return {envVariables, featerVariables} as PrepareSourceEnvVarsCommandResultInterface;
    }

}
