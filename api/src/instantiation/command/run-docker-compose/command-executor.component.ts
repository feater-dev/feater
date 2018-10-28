import * as _ from 'lodash';
import * as path from 'path';
import * as split from 'split';
import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {environment} from '../../../environment/environment';
import {SimpleCommand} from '../../executor/simple-command';
import {RunDockerComposeCommand} from './command';

@Injectable()
export class RunDockerComposeCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof RunDockerComposeCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as RunDockerComposeCommand;

        return new Promise((resolve, reject) => {
            const dockerComposeArgs = [];

            for (const absoluteGuestComposeFilePath of typedCommand.absoluteGuestComposeFilePaths) {
                dockerComposeArgs.push(
                    ['--file', path.relative(typedCommand.absoluteGuestEnvDirPath, absoluteGuestComposeFilePath)],
                );
            }
            dockerComposeArgs.push(['up', '-d', '--no-color']);

            const runEnvVariables = new EnvVariablesSet();
            runEnvVariables.add('COMPOSE_HTTP_TIMEOUT', `${environment.instantiation.composeHttpTimeout}`);

            console.log(
                EnvVariablesSet.merge(
                    typedCommand.envVariables,
                    runEnvVariables,
                ).toString(),
                _.flatten(dockerComposeArgs).join(' ')
            );

            // TODO Handle spawn result using helper class.
            const dockerCompose = spawn(
                environment.instantiation.composeBinaryPath,
                _.flatten(dockerComposeArgs),
                {
                    cwd: typedCommand.absoluteGuestEnvDirPath,
                    env: EnvVariablesSet.merge(
                        typedCommand.envVariables,
                        runEnvVariables,
                    ).toMap(),
                },
            );

            dockerCompose.stdout
                .pipe(split())
                .on('data', line => {
                    // logger.info(line);
                });

            dockerCompose.stderr
                .pipe(split())
                .on('data', line => {
                    // logger.info(line.toString());
                });

            dockerCompose.on('error', error => {
                // logger.error(error.message);
                reject(error);
            });

            const onCloseOrExit = code => {
                if (0 !== code) {
                    // logger.error(`Failed to run docker-compose.`);
                    reject(code);

                    return;
                }
                resolve({});
            };

            dockerCompose.on('close', onCloseOrExit);
            dockerCompose.on('exit', onCloseOrExit);
        });

    }

}
