import * as escapeStringRegexp from 'escape-string-regexp';
import {execSync} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {GetContainerIdsCommandResultInterface, GetContainerIdsCommandResultServiceContainerIdInterface} from './command-result.interface';
import {GetContainerIdsCommand} from './command';
import {environment} from '../../../environment/environment';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';

const BUFFER_SIZE = 16 * 1048576; // 16M

@Injectable()
export class GetContainerIdsCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand) {
        return (command instanceof GetContainerIdsCommand);
    }

    execute(command: SimpleCommand) {
        const typedCommand = command as GetContainerIdsCommand;

        return new Promise((resolve, reject) => {
            // logger.info('Determining container ids.');

            const containerInspects = JSON.parse(
                execSync(
                    [
                        environment.instantiation.dockerBinaryPath,
                        'inspect',
                        `$(${environment.instantiation.dockerBinaryPath} ps -q --no-trunc --filter name=${typedCommand.composeProjectName})`,
                    ].join(' '),
                    {maxBuffer: BUFFER_SIZE},
                ).toString(),
            );

            const envVariables = new EnvVariablesSet();
            const featerVariables = new FeaterVariablesSet();
            const serviceContainerIds: GetContainerIdsCommandResultServiceContainerIdInterface[] = [];
            for (const {serviceId, containerNamePrefix} of typedCommand.serviceContainerNamePrefixes) {
                const containerNameRegExp = new RegExp(`^/${escapeStringRegexp(containerNamePrefix)}_1+$`);
                for (const containerInspect of containerInspects) {
                    const containerId: string = containerInspect.Id;
                    if (containerNameRegExp.test(containerInspect.Name)) {
                        serviceContainerIds.push({serviceId, containerId});
                        envVariables.add(`FEATER__CONTAINER_ID__${serviceId.toUpperCase()}`, containerId);
                        featerVariables.add(`container_id__${serviceId.toLowerCase()}`, containerId);
                    }
                }
            }

            resolve({serviceContainerIds, envVariables, featerVariables} as GetContainerIdsCommandResultInterface);
        });
    }

}
