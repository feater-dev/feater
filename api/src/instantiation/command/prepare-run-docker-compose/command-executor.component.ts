import * as _ from 'lodash';
import * as path from 'path';
import {Injectable} from '@nestjs/common';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {environment} from '../../../environments/environment';
import {SimpleCommand} from '../../executor/simple-command';
import {PrepareRunDockerComposeCommand} from './command';
import {PrepareRunDockerComposeCommandResultInterface} from './command-result.interface';

@Injectable()
export class PrepareRunDockerComposeCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof PrepareRunDockerComposeCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as PrepareRunDockerComposeCommand;
        const logger = typedCommand.commandLogger;

        let args = [];
        for (const absoluteGuestComposeFilePath of typedCommand.absoluteGuestComposeFilePaths) {
            args.push(
                ['--file', path.relative(typedCommand.absoluteGuestEnvDirPath, absoluteGuestComposeFilePath)],
            );
        }
        args.push(['up', '-d', '--no-color']);
        args = _.flatten(args);

        let envVariables = new EnvVariablesSet();
        envVariables.add('COMPOSE_HTTP_TIMEOUT', `${environment.instantiation.composeHttpTimeout}`);
        envVariables = envVariables.merge(typedCommand.envVariables);

        logger.info(`Guest working directory: ${typedCommand.absoluteGuestEnvDirPath}`);
        logger.info(`Environmental variables:${
            envVariables.isEmpty()
                ? ' none'
                : '\n' + JSON.stringify(envVariables.toMap(), null, 2)
        }`);
        logger.info(`Arguments:\n${JSON.stringify(args, null, 2)}`);

        return {
            args,
            absoluteGuestEnvDirPath: typedCommand.absoluteGuestEnvDirPath,
            envVariables,
        } as PrepareRunDockerComposeCommandResultInterface;
    }

}
