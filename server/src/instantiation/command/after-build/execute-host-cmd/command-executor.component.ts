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

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as ExecuteHostCmdCommand;
        const commandLogger = typedCommand.commandLogger;

        commandLogger.info(`Collecting environmental variables.`);
        const envVariables = new EnvVariablesSet();
        for (const {name, value} of typedCommand.customEnvVariables.toList()) {
            envVariables.add(name, value);
        }
        commandLogger.info(`Custom environmental variables collected.`);

        const collectedEnvVariablesMap = typedCommand.collectedEnvVariables.toMap();
        for (const {name, alias} of typedCommand.inheritedEnvVariables) {
            envVariables.add(alias, collectedEnvVariablesMap[name]);
        }
        commandLogger.info(`Inherited environmental variables collected.`);

        commandLogger.info(`Executing host command.`);
        commandLogger.info(`Command: ${typedCommand.command[0]}`);
        commandLogger.info(`Arguments: ${JSON.stringify(typedCommand.command.slice(1))}`);
        commandLogger.info(`Guest working directory: ${typedCommand.absoluteGuestInstancePath}`);
        commandLogger.infoWithEnvVariables(envVariables, 'Environmental variables');

        await this.spawnHelper.promisifySpawnedWithHeader(
            spawn(
                typedCommand.command[0],
                typedCommand.command.slice(1),
                {
                    cwd: typedCommand.absoluteGuestInstancePath,
                    env: envVariables.toMap(),
                },
            ),
            commandLogger,
            'execute host command',
        );

        return {};
    }

}
