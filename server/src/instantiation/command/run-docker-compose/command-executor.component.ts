import * as _ from 'lodash';
import * as path from 'path';
import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {config} from '../../../config/config';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
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

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as RunDockerComposeCommand;
        const commandLogger = typedCommand.commandLogger;

        let dockerComposeArgs = [];

        for (const absoluteGuestComposeFilePath of typedCommand.absoluteGuestComposeFilePaths) {
            dockerComposeArgs.push(
                ['--file', path.relative(typedCommand.absoluteGuestEnvDirPath, absoluteGuestComposeFilePath)],
            );
        }
        dockerComposeArgs.push(['up', '-d', '--no-color']);

        const runEnvVariables = new EnvVariablesSet();
        runEnvVariables.add('COMPOSE_HTTP_TIMEOUT', `${config.instantiation.dockerComposeHttpTimeout}`);

        dockerComposeArgs = _.flatten(dockerComposeArgs);

        const envVariables = EnvVariablesSet.merge(
            typedCommand.envVariables,
            runEnvVariables,
        );

        commandLogger.info(`Binary: ${config.instantiation.dockerComposeBinaryPath}`);
        commandLogger.info(`Arguments: ${JSON.stringify(dockerComposeArgs)}`);
        commandLogger.info(`Guest working directory: ${typedCommand.absoluteGuestEnvDirPath}`);
        commandLogger.infoWithEnvVariables(envVariables, 'Environmental variables');

        await this.spawnHelper.promisifySpawnedWithHeader(
            spawn(
                config.instantiation.dockerComposeBinaryPath,
                dockerComposeArgs,
                {
                    cwd: typedCommand.absoluteGuestEnvDirPath,
                    env: envVariables.toMap(),
                },
            ),
            commandLogger,
            'run docker-compose',
        );

        return {};
    }

}
