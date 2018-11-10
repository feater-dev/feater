import * as _ from 'lodash';
import * as path from 'path';
import * as split from 'split';
import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {EnvVariablesSet} from '../../sets/env-variables-set';
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
            let dockerComposeArgs = [];

            for (const absoluteGuestComposeFilePath of typedCommand.absoluteGuestComposeFilePaths) {
                dockerComposeArgs.push(
                    ['--file', path.relative(typedCommand.absoluteGuestEnvDirPath, absoluteGuestComposeFilePath)],
                );
            }
            dockerComposeArgs.push(['up', '-d', '--no-color']);

            const runEnvVariables = new EnvVariablesSet();
            runEnvVariables.add('COMPOSE_HTTP_TIMEOUT', `${environment.instantiation.composeHttpTimeout}`);

            dockerComposeArgs = _.flatten(dockerComposeArgs);

            const envVariables = EnvVariablesSet.merge(
                typedCommand.envVariables,
                runEnvVariables,
            );

            logger.info(`Binary: ${environment.instantiation.composeBinaryPath}`);
            logger.info(`Arguments: ${JSON.stringify(dockerComposeArgs)}`);
            logger.info(`Guest working directory: ${typedCommand.absoluteGuestEnvDirPath}`);
            logger.info(`Environmental variables:${
                envVariables.isEmpty()
                    ? ' none'
                    : '\n' + JSON.stringify(envVariables.toString(), null, 2)
            }`);

            const spawnedDockerCompose = spawn(
                environment.instantiation.composeBinaryPath,
                dockerComposeArgs,
                {
                    cwd: typedCommand.absoluteGuestEnvDirPath,
                    env: envVariables.toMap(),
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
