import {environment} from '../../../environments/environment';
import * as path from 'path';
import * as fs from 'fs';
import {execSync} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {EnableProxyDomainsCommand} from './command';
import {SimpleCommand} from '../../executor/simple-command';

const BUFFER_SIZE = 16 * 1048576; // 16M

@Injectable()
export class EnableProxyDomainsCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof EnableProxyDomainsCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as EnableProxyDomainsCommand;
        const logger = typedCommand.commandLogger;

        const nginxConfigAbsoluteGuestPath = path.join(
            environment.guestPaths.proxyDomain,
            `instance-${typedCommand.instanceHash}.conf`,
        );
        logger.info(`Absolute guest Nginx configuration path: ${nginxConfigAbsoluteGuestPath}`);
        fs.writeFileSync(
            nginxConfigAbsoluteGuestPath,
            typedCommand.nginxConfigs.join('\n\n'),
        );

        logger.info(`Restarting Nginx.`);
        execSync(
            `docker exec -t feater_nginx /etc/init.d/nginx restart`,
            { maxBuffer: BUFFER_SIZE },
        );

        return {};
    }

}
