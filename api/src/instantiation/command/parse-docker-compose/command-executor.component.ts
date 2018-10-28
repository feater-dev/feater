import * as path from 'path';
import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
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

        const serviceIds: any = {};
        const services: ParseDockerComposeCommandResultServiceInterface[] = [];
        for (const absoluteGuestComposeFilePath of typedCommand.absoluteGuestComposeFilePaths) {
            const compose = jsYaml.safeLoad(
                fs.readFileSync(absoluteGuestComposeFilePath).toString(),
            );

            for (const serviceId of Object.keys(compose.services)) {
                if (serviceIds[serviceId]) {
                    continue;
                }
                serviceIds[serviceId] = true;
                services.push({
                    id: serviceId,
                    containerNamePrefix: `${typedCommand.composeProjectName}_${serviceId}`,
                });
            }
        }

        return {services} as ParseDockerComposeCommandResultInterface;
    }

}
