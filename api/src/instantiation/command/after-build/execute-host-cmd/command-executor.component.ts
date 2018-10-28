import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../simple-command-executor-component.interface';
import {EnvVariablesSet} from '../../../sets/env-variables-set';
import * as split from 'split';
import {SimpleCommand} from '../../../executor/simple-command';
import {ExecuteHostCmdCommand} from './command';

@Injectable()
export class ExecuteHostCmdCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof ExecuteHostCmdCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as ExecuteHostCmdCommand;

        return new Promise<any>((resolve, reject) => {
            const envVariables = new EnvVariablesSet();
            for (const {name, value} of typedCommand.customEnvVariables.toList()) {
                envVariables.add(name, value);
            }

            const collectedEnvVariablesMap = typedCommand.collectedEnvVariables.toMap();
            for (const {name, alias} of typedCommand.inheritedEnvVariables) {
                envVariables.add(alias, collectedEnvVariablesMap[name]);
            }

            // TODO Handle spawn result using helper class.
            const hostCommand = spawn(
                typedCommand.command[0],
                typedCommand.command.slice(1),
                {
                    cwd: typedCommand.absoluteGuestInstancePath,
                    env: envVariables.toMap(),
                },
            );

            hostCommand.stdout
                .pipe(split())
                .on('data', line => {
                    // logger.info(line); // Is it a string or is it necessary to use .toString() like before?
                });

            hostCommand.stderr
                .pipe(split())
                .on('data', line => {
                    // logger.info(line);
                });

            hostCommand.on('error', error => {
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

            hostCommand.on('close', onCloseOrExit);
            hostCommand.on('exit', onCloseOrExit);
        });

    }

}
