import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../simple-command-executor-component.interface';
import {EnvVariablesSet} from '../../../sets/env-variables-set';
import * as split from 'split';
import {SimpleCommand} from '../../../executor/simple-command';
import {ExecuteServiceCmdCommand} from './command';

@Injectable()
export class ExecuteServiceCmdCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof ExecuteServiceCmdCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as ExecuteServiceCmdCommand;

        return new Promise<any>((resolve, reject) => {
            const envVariables = new EnvVariablesSet();
            for (const {name, value} of typedCommand.customEnvVariables.toList()) {
                envVariables.add(name, value);
            }

            const collectedEnvVariablesMap = typedCommand.collectedEnvVariables.toMap();
            for (const {name, alias} of typedCommand.inheritedEnvVariables) {
                envVariables.add(alias || name, collectedEnvVariablesMap[name]);
            }

            let cmd = ['docker', 'exec'];

            for (const {name, value} of envVariables.toList()) {
                cmd = cmd.concat(['-e', `${name}=${value}`]);
            }

            cmd.push(typedCommand.containerId);
            cmd = cmd.concat(typedCommand.command);

            // TODO Handle spawn result using helper class.
            const serviceCommand = spawn(
                cmd[0],
                cmd.slice(1),
                {
                    cwd: typedCommand.absoluteGuestInstancePath,
                },
            );

            serviceCommand.stdout
                .pipe(split())
                .on('data', line => {
                    // logger.info(line);
                });

            serviceCommand.stderr
                .pipe(split())
                .on('data', line => {
                    // logger.info(line);
                });

            serviceCommand.on('error', error => {
                // logger.error(`Failed to execute host testCommand (error message: '${error.message}').`);
                reject(error);
            });

            const onCloseOrExit = code => {
                if (0 !== code) {
                    // logger.error(`Failed to execute host testCommand with code ${code}.`);
                    reject(code);

                    return;
                }
                resolve({});
            };

            serviceCommand.on('close', onCloseOrExit);
            serviceCommand.on('exit', onCloseOrExit);
        });

    }

}
