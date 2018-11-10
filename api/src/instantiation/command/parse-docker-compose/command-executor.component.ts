import * as path from 'path';
import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
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
        const logger = typedCommand.commandLogger;

        const processedServiceIds: any = {};
        const services: ParseDockerComposeCommandResultServiceInterface[] = [];
        for (const absoluteGuestComposeFilePath of typedCommand.absoluteGuestComposeFilePaths) {
            logger.info(`Parsing compose file.`);
            logger.info(`Parsed compose file absolute guest path: ${absoluteGuestComposeFilePath}`);

            const compose = jsYaml.safeLoad(
                fs.readFileSync(absoluteGuestComposeFilePath).toString(),
            );
            const serviceIds = Object.keys(compose.services);

            logger.info(`Service IDs found: ${serviceIds.join(', ')}`);

            for (const serviceId of serviceIds) {
                if (processedServiceIds[serviceId]) {
                    continue;
                }
                processedServiceIds[serviceId] = true;
                const containerNamePrefix = `${typedCommand.composeProjectName}_${serviceId}`;
                services.push({
                    id: serviceId,
                    containerNamePrefix,
                });
                logger.info(`Container name prefix for service ${serviceId}: ${containerNamePrefix}`);
            }
        }

        return {services} as ParseDockerComposeCommandResultInterface;
    }

}
