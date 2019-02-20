import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../../executor/simple-command-executor-component.interface';
import {EnvVariablesSet} from '../../../sets/env-variables-set';
import {SimpleCommand} from '../../../executor/simple-command';
import {ExecuteHostCmdCommand} from './command';
import {SpawnHelper} from '../../../helper/spawn-helper.component';

@Injectable()
export class ExecuteHostCmdCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof ExecuteHostCmdCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as ExecuteHostCmdCommand;
        const logger = typedCommand.commandLogger;

        return new Promise<any>((resolve, reject) => {
            logger.info(`Collecting environmental variables.`);
            const envVariables = new EnvVariablesSet();
            for (const {name, value} of typedCommand.customEnvVariables.toList()) {
                envVariables.add(name, value);
            }
            logger.info(`Custom environmental variables collected.`);

            const collectedEnvVariablesMap = typedCommand.collectedEnvVariables.toMap();
            for (const {name, alias} of typedCommand.inheritedEnvVariables) {
                envVariables.add(alias, collectedEnvVariablesMap[name]);
            }
            logger.info(`Inherited environmental variables collected.`);

            logger.info(`Executing host command.`);
            logger.info(`Command: ${typedCommand.command[0]}`);
            logger.info(`Arguments: ${JSON.stringify(typedCommand.command.slice(1))}`);
            logger.info(`Guest working directory: ${typedCommand.absoluteGuestInstancePath}`);
            logger.infoWithEnvVariables(envVariables, 'Environmental variables');

            const spawnedHostCommand = spawn(
                typedCommand.command[0],
                typedCommand.command.slice(1),
                {
                    cwd: typedCommand.absoluteGuestInstancePath,
                    env: envVariables.toMap(),
                },
            );

            this.spawnHelper.handleSpawned(
                spawnedHostCommand,
                logger,
                resolve,
                reject,
                () => {},
                (exitCode: number) => {
                    logger.error(`Failed to execute host command.`, {});
                    logger.error(`Exit code: ${exitCode}`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to execute host command.`, {});
                    logger.error(`Error message: ${error.message}`, {});
                },
            );
        });
    }

}
