import * as path from 'path';
import * as jsYaml from 'js-yaml';
import {spawnSync} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {ParseDockerComposeCommand} from './command';
import {
    ParseDockerComposeCommandResultInterface,
    ParseDockerComposeCommandResultServiceInterface,
} from './command-result.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {config} from '../../../config/config';

@Injectable()
export class ParseDockerComposeCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof ParseDockerComposeCommand);
    }

    async execute(command: SimpleCommand): Promise<ParseDockerComposeCommandResultInterface> {
        const {
            sourceDockerVolumeName,
            envDirRelativePath,
            composeFileRelativePaths,
            envVariables,
            composeProjectName,
            workingDirectory,
            commandLogger,
        } = command as ParseDockerComposeCommand;

        // TODO Move to config and env variables.
        const hostDockerSocketPath = '/var/run/docker.sock';

        const composeConfigCommand = config.instantiation.dockerBinaryPath;
        const composeConfigArguments: string[] = [];

        composeConfigArguments.push(
            'run',
            '--rm',
            '-e', `COMPOSE_HTTP_TIMEOUT=${config.instantiation.dockerComposeHttpTimeout}`,
        );

        for (const envVariable of envVariables.toList()) {
            composeConfigArguments.push(
                '-e', `${envVariable.name}=${envVariable.value}`,
            );
        }

        composeConfigArguments.push(
            '-w', path.join('/source', envDirRelativePath),
            '-v', `${sourceDockerVolumeName}:/source`,
            '-v', `${hostDockerSocketPath}:/var/run/docker.sock`,
            `docker/compose:${config.instantiation.dockerComposeVersion}`,
        );

        for (const composeFileRelativePath of composeFileRelativePaths) {
            composeConfigArguments.push(
                '-f',
                path.relative(envDirRelativePath, composeFileRelativePath),
            );
        }

        composeConfigArguments.push('config');

        commandLogger.info(`Source volume name: ${sourceDockerVolumeName}`);
        commandLogger.info(`Command: ${composeConfigCommand}`);
        commandLogger.info(`Arguments: ${JSON.stringify(composeConfigArguments)}`);

        const dockerComposeConfigSpawnResult = spawnSync(
            composeConfigCommand,
            composeConfigArguments,
            {cwd: workingDirectory},
        );

        // TODO Add some error handling.

        const combinedComposeConfiguration = dockerComposeConfigSpawnResult.stdout.toString();
        commandLogger.info(`Combined compose configuration (some environmental variable values not available yet):\n${combinedComposeConfiguration}`);

        const compose = jsYaml.safeLoad(combinedComposeConfiguration);

        const serviceIds = Object.keys(compose.services || {});

        if (0 === serviceIds.length) {
            throw new Error('No service IDs found.');
        }
        commandLogger.info(`Service IDs found: ${serviceIds.join(', ')}`);

        const services: ParseDockerComposeCommandResultServiceInterface[] = [];
        for (const serviceId of serviceIds) {
            const containerNamePrefix = `${composeProjectName}_${serviceId}`;
            services.push({
                id: serviceId,
                containerNamePrefix,
            });
            commandLogger.info(`Container name prefix for service ${serviceId}: ${containerNamePrefix}`);
        }

        return {services} as ParseDockerComposeCommandResultInterface;
    }

}
