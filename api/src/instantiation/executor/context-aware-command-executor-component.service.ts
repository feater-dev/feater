import {ContextAwareCommand} from './context-aware-command.interface';
import {SimpleCommandExecutorComponent} from './simple-command-executor.component';
import {Injectable} from '@nestjs/common';
import {CommandLogRepository} from '../../persistence/repository/command-log.repository';
import {CommandLogger} from '../logger/command-logger';
import {BaseLogger} from '../../logger/base-logger';

@Injectable()
export class ContextAwareCommandExecutorComponent {
    constructor(
        private readonly simpleCommandExecutorComponent: SimpleCommandExecutorComponent,
        private readonly commandLogRepository: CommandLogRepository,
        private readonly baseLogger: BaseLogger,
    ) {}

    async execute(command: ContextAwareCommand, context: any): Promise<void> {
        const commandLog = await command.createCommandLog(context, this.commandLogRepository);
        const commandLogger = new CommandLogger(commandLog, this.baseLogger);
        const wrappedCommand = command.createWrappedCommand(context);
        wrappedCommand.commandLogger = commandLogger;

        try {
            const result = await this.simpleCommandExecutorComponent.execute(wrappedCommand);
            if (command.processResult) {
                command.processResult(result, context);
            }
            await commandLogger.markAsCompleted();
            commandLogger.info('Command completed.');
        } catch (e) {
            await commandLogger.markAsFailed();
            commandLogger.info('Command failed.');

            throw e;
        }
    }
}
