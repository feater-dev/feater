import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../../executor/simple-command-executor-component.interface';
import {EnvVariablesSet} from '../../../sets/env-variables-set';
import {SimpleCommand} from '../../../executor/simple-command';
import {ExecuteServiceCmdCommand} from './command';
import {SpawnHelper} from '../../../helper/spawn-helper.component';

@Injectable()
export class ExecuteServiceCmdCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof ExecuteServiceCmdCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as ExecuteServiceCmdCommand;
        const commandLogger = typedCommand.commandLogger;

        commandLogger.info(`Collecting environmental variables.`);
        const envVariables = new EnvVariablesSet();
        for (const {name, value} of typedCommand.customEnvVariables.toList()) {
            envVariables.add(name, value);
        }
        commandLogger.info(`Custom environmental variables collected.`);

        const collectedEnvVariablesMap = typedCommand.collectedEnvVariables.toMap();
        for (const {name, alias} of typedCommand.inheritedEnvVariables) {
            envVariables.add(alias || name, collectedEnvVariablesMap[name]);
        }
        commandLogger.info(`Inherited environmental variables collected.`);

        commandLogger.info(`Executing service command.`);
        commandLogger.info(`Container ID: ${typedCommand.containerId}`);
        commandLogger.info(`Command: ${typedCommand.command[0]}`);
        commandLogger.info(`Arguments: ${JSON.stringify(typedCommand.command.slice(1))}`);
        commandLogger.info(`Guest working directory: ${typedCommand.absoluteGuestInstancePath}`);
        commandLogger.infoWithEnvVariables(envVariables, 'Environmental variables');

        let cmd = ['docker', 'exec'];

        for (const {name, value} of envVariables.toList()) {
            cmd = cmd.concat(['-e', `${name}=${value}`]);
        }

        cmd.push(typedCommand.containerId);
        cmd = cmd.concat(typedCommand.command);

        await this.spawnHelper.promisifySpawnedWithHeader(
            spawn(
                cmd[0],
                cmd.slice(1),
                {
                    cwd: typedCommand.absoluteGuestInstancePath,
                },
            ),
            typedCommand.commandLogger,
            'execute service command',
        );

        return {};
    }

}
