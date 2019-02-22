import * as path from 'path';
import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {config} from '../../../config/config';
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

        const hostDockerSocketPath = '/var/run/docker.sock'; // TODO Move to config and env variables.

        const composeUpCommand = config.instantiation.dockerBinaryPath;
        const composeUpArguments: string[] = [];

        composeUpArguments.push(
            'run',
            '--rm',
            '-e', `COMPOSE_HTTP_TIMEOUT=${config.instantiation.dockerComposeHttpTimeout}`,
        );

        for (const envVariable of typedCommand.envVariables.toList()) {
            composeUpArguments.push(
                '-e', `${envVariable.name}=${envVariable.value}`,
            );
        }

        composeUpArguments.push(
            '-w', path.join('/source', typedCommand.envDirRelativePath),
            '-v', `${hostDockerSocketPath}:/var/run/docker.sock`,
            '-v', `${typedCommand.sourceDockerVolumeName}:/source`,
            'docker/compose:1.23.2', // TODO Move to config and env variables.
        );

        for (const composeFileRelativePath of typedCommand.composeFileRelativePaths) {
            composeUpArguments.push(
                '-f',
                path.relative(typedCommand.envDirRelativePath, composeFileRelativePath),
            );
        }

        composeUpArguments.push('up', '-d', '--no-color');

        commandLogger.info(`Source volume name: ${typedCommand.sourceDockerVolumeName}`);
        commandLogger.info(`Command: ${composeUpCommand}`);
        commandLogger.info(`Arguments: ${JSON.stringify(composeUpArguments)}`);

        await this.spawnHelper.promisifySpawnedWithHeader(
            spawn(
                composeUpCommand,
                composeUpArguments,
                {cwd: typedCommand.workingDirectory},
            ),
            commandLogger,
            'run compose',
        );

        return {};
    }

}
