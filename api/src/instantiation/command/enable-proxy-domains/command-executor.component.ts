import {environment} from '../../../environment/environment';
import * as path from 'path';
import * as fs from 'fs';
import {execSync} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {EnableProxyDomainsCommand} from './command';
import {SimpleCommand} from '../../executor/simple-command';

const BUFFER_SIZE = 1048576; // 1M

@Injectable()
export class EnableProxyDomainsCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof EnableProxyDomainsCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as EnableProxyDomainsCommand;

        return new Promise<any>(resolve => {
            fs.writeFileSync(
                path.join(environment.guestPaths.proxyDomain, `instance-${typedCommand.instanceHash}.conf`),
                typedCommand.nginxConfigs.join('\n\n'),
            );

            execSync(
                `docker exec -t feat_nginx /etc/init.d/nginx restart`,
                { maxBuffer: BUFFER_SIZE },
            );

            resolve({});
        });
    }

}
