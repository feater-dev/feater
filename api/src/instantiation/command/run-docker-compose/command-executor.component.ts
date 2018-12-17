import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {environment} from '../../../environments/environment';
import {SimpleCommand} from '../../executor/simple-command';
import {RunDockerComposeCommand} from './command';
import {SpawnHelper} from '../../helper/spawn-helper.component';

@Injectable()
export class RunDockerComposeCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof RunDockerComposeCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as RunDockerComposeCommand;
        const logger = typedCommand.commandLogger;

        return new Promise((resolve, reject) => {
            logger.info(`Binary: ${environment.instantiation.composeBinaryPath}`);
            logger.info(`Guest env directory: ${typedCommand.absoluteGuestEnvDirPath}`);
            logger.info(`Environmental variables:${
                typedCommand.envVariables.isEmpty()
                    ? ' none'
                    : '\n' + JSON.stringify(typedCommand.envVariables.toMap(), null, 2)
            }`);
            logger.info(`Arguments:\n${JSON.stringify(typedCommand.args, null, 2)}`);

            const spawnedDockerCompose = spawn(
                environment.instantiation.composeBinaryPath,
                typedCommand.args,
                {
                    cwd: typedCommand.absoluteGuestEnvDirPath,
                    env: typedCommand.envVariables.toMap(),
                },
            );

            this.spawnHelper.handleSpawned(
                spawnedDockerCompose,
                logger,
                resolve,
                reject,
                () => {},
                (exitCode: number) => {
                    logger.error(`Failed to run docker-compose.'`, {});
                    logger.error(`Exit code: ${exitCode}`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to run docker-compose.`);
                    logger.error(`Error message: ${error.message}`, {});
                },
            );
        });

    }

}
