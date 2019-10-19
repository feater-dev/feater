import * as path from 'path';
import { spawn } from 'child_process';
import { Injectable } from '@nestjs/common';
import { config } from '../../../config/config';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { SimpleCommand } from '../../executor/simple-command';
import { RunDockerComposeCommand } from './command';
import { SpawnHelper } from '../../helper/spawn-helper.component';

@Injectable()
export class RunDockerComposeCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    constructor(private readonly spawnHelper: SpawnHelper) {}

    supports(command: SimpleCommand): boolean {
        return command instanceof RunDockerComposeCommand;
    }

    async execute(command: SimpleCommand): Promise<unknown> {
        const {
            sourceDockerVolumeName,
            envDirRelativePath,
            composeFileRelativePaths,
            envVariables,
            workingDirectory,
            commandLogger,
        } = command as RunDockerComposeCommand;

        // TODO Move to recipe and env variables.
        const hostDockerSocketPath = '/var/run/docker.sock';

        const composeUpCommand = config.instantiation.dockerBinaryPath;
        const composeUpArguments: string[] = [];

        composeUpArguments.push(
            'run',
            '--rm',
            '-e',
            `COMPOSE_HTTP_TIMEOUT=${config.instantiation.dockerComposeHttpTimeout}`,
        );

        for (const envVariable of envVariables.toList()) {
            composeUpArguments.push(
                '-e',
                `${envVariable.name}=${envVariable.value}`,
            );
        }

        composeUpArguments.push(
            '-w',
            path.join('/source', envDirRelativePath),
            '-v',
            `${hostDockerSocketPath}:/var/run/docker.sock`,
            '-v',
            `${sourceDockerVolumeName}:/source`,
            `docker/compose:${config.instantiation.dockerComposeVersion}`,
        );

        for (const composeFileRelativePath of composeFileRelativePaths) {
            composeUpArguments.push(
                '-f',
                path.relative(envDirRelativePath, composeFileRelativePath),
            );
        }

        composeUpArguments.push('up', '-d', '--no-color');

        commandLogger.info(`Source volume name: ${sourceDockerVolumeName}`);
        commandLogger.info(`Command: ${composeUpCommand}`);
        commandLogger.info(`Arguments: ${JSON.stringify(composeUpArguments)}`);

        await this.spawnHelper.promisifySpawnedWithHeader(
            spawn(composeUpCommand, composeUpArguments, {
                cwd: workingDirectory,
            }),
            commandLogger,
            'run compose',
        );

        return {};
    }
}
