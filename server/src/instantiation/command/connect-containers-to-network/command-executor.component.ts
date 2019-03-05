import {config} from '../../../config/config';
import {execSync} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {ConnectToNetworkCommand} from './command';
import {ConnectToNetworkCommandResultInterface} from './command-result.interface';
import {SimpleCommand} from '../../executor/simple-command';

const BUFFER_SIZE = 16 * 1048576; // 16M

@Injectable()
export class ConnectToNetworkCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof ConnectToNetworkCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            serviceId,
            containerId,
            commandLogger,
        } = command as ConnectToNetworkCommand;

        commandLogger.info(`Service ID: ${serviceId}`);
        commandLogger.info(`Container ID: ${containerId}`);
        commandLogger.info(`Network: ${config.instantiation.proxyNetworkName}`);

        execSync(
            `docker network connect ${config.instantiation.proxyNetworkName} ${containerId}`,
            { maxBuffer: BUFFER_SIZE },
        );

        const dockerInspectStdout = execSync(
            `docker inspect ${containerId}`,
            { maxBuffer: BUFFER_SIZE },
        );

        const inspectResult = JSON.parse(dockerInspectStdout.toString())[0];
        const ipAddress = inspectResult.NetworkSettings.Networks[config.instantiation.proxyNetworkName].IPAddress;

        commandLogger.info(`IP address: ${ipAddress}`);

        return {
            serviceId: serviceId,
            ipAddress,
        } as ConnectToNetworkCommandResultInterface;
    }

}
