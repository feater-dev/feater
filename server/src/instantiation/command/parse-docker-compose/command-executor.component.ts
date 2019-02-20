import * as jsYaml from 'js-yaml';
import * as _ from 'lodash';
import {spawnSync} from "child_process";
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {ParseDockerComposeCommand} from './command';
import {
    ParseDockerComposeCommandResultInterface,
    ParseDockerComposeCommandResultServiceInterface,
} from './command-result.interface';
import {SimpleCommand} from '../../executor/simple-command';

@Injectable()
export class ParseDockerComposeCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof ParseDockerComposeCommand);
    }

    async execute(command: SimpleCommand): Promise<ParseDockerComposeCommandResultInterface> {
        const typedCommand = command as ParseDockerComposeCommand;
        const commandLogger = typedCommand.commandLogger;

        commandLogger.info(`Combined compose file absolute guest paths:\n${typedCommand.absoluteGuestComposeFilePaths.join('\n')}`);

        const composeConfigArguments = [];
        for (const absoluteGuestComposeFilePath of typedCommand.absoluteGuestComposeFilePaths) {
            composeConfigArguments.push(['-f', absoluteGuestComposeFilePath]);
        }
        composeConfigArguments.push('config');

        const dockerComposeConfigSpawnResult = spawnSync('docker-compose', _.flattenDeep(composeConfigArguments));
        // TODO Add some error handling.
        const combinedComposeConfiguration = dockerComposeConfigSpawnResult.stdout.toString();
        commandLogger.info(`Combined compose configuration (env variable values not available yet):\n${combinedComposeConfiguration}`);

        const compose = jsYaml.safeLoad(combinedComposeConfiguration);

        const serviceIds = Object.keys(compose.services || {});

        if (0 === serviceIds.length) {
            throw new Error('No service IDs found.');
        }
        commandLogger.info(`Service IDs found: ${serviceIds.join(', ')}`);

        const services: ParseDockerComposeCommandResultServiceInterface[] = [];
        for (const serviceId of serviceIds) {
            const containerNamePrefix = `${typedCommand.composeProjectName}_${serviceId}`;
            services.push({
                id: serviceId,
                containerNamePrefix,
            });
            commandLogger.info(`Container name prefix for service ${serviceId}: ${containerNamePrefix}`);
        }

        return {services} as ParseDockerComposeCommandResultInterface;
    }

}
