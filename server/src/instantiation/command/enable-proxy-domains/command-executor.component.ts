import { config } from '../../../config/config';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { EnableProxyDomainsCommand } from './command';
import { SimpleCommand } from '../../executor/simple-command';

const BUFFER_SIZE = 16 * 1048576; // 16M

@Injectable()
export class EnableProxyDomainsCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    supports(command: SimpleCommand): boolean {
        return command instanceof EnableProxyDomainsCommand;
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            instanceHash,
            nginxConfigs,
            commandLogger,
        } = command as EnableProxyDomainsCommand;

        const nginxConfigAbsoluteGuestPath = path.join(
            config.guestPaths.proxy,
            `instance-${instanceHash}.conf`,
        );
        commandLogger.info(
            `Absolute guest Nginx configuration path: ${nginxConfigAbsoluteGuestPath}`,
        );
        fs.writeFileSync(
            nginxConfigAbsoluteGuestPath,
            nginxConfigs.join('\n\n'),
        );

        commandLogger.info(`Reloading Nginx.`);
        execSync(
            `nginx -s reload`, // TODO Make customizable.
            { maxBuffer: BUFFER_SIZE },
        );

        return {};
    }
}
