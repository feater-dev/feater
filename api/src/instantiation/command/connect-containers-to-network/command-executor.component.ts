import {environment} from '../../../environment/environment';
import {execSync} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {ConnectToNetworkCommand} from './command';
import {ConnectToNetworkCommandResultInterface} from './command-result.interface';
import {SimpleCommand} from '../../executor/simple-command';

@Injectable()
export class ConnectToNetworkCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    readonly BUFFER_SIZE = 1048576; // 1M

    supports(command: SimpleCommand): boolean {
        return (command instanceof ConnectToNetworkCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as ConnectToNetworkCommand;

        execSync(
            `docker network connect ${environment.instantiation.proxyDomainsNetworkName} ${typedCommand.containerId}`,
            { maxBuffer: this.BUFFER_SIZE },
        );

        const dockerInspectStdout = execSync(
            `docker inspect ${typedCommand.containerId}`,
            { maxBuffer: this.BUFFER_SIZE },
        );

        const inspectResult = JSON.parse(dockerInspectStdout.toString())[0];
        const ipAddress = inspectResult.NetworkSettings.Networks[environment.instantiation.proxyDomainsNetworkName].IPAddress;

        return {
            serviceId: typedCommand.serviceId,
            ipAddress,
        } as ConnectToNetworkCommandResultInterface;
    }

}
