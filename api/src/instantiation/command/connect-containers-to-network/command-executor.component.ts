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
        const typedCommand = command as ConnectToNetworkCommand;
        const logger = typedCommand.commandLogger;

        logger.info(`Service ID: ${typedCommand.serviceId}`);
        logger.info(`Container ID: ${typedCommand.containerId}`);
        logger.info(`Network: ${config.instantiation.proxyDomainNetworkName}`);

        execSync(
            `docker network connect ${config.instantiation.proxyDomainNetworkName} ${typedCommand.containerId}`,
            { maxBuffer: BUFFER_SIZE },
        );

        const dockerInspectStdout = execSync(
            `docker inspect ${typedCommand.containerId}`,
            { maxBuffer: BUFFER_SIZE },
        );

        const inspectResult = JSON.parse(dockerInspectStdout.toString())[0];
        const ipAddress = inspectResult.NetworkSettings.Networks[config.instantiation.proxyDomainNetworkName].IPAddress;

        logger.info(`IP address: ${ipAddress}`);

        return {
            serviceId: typedCommand.serviceId,
            ipAddress,
        } as ConnectToNetworkCommandResultInterface;
    }

}
