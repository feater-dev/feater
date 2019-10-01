import { CommandLogInterface } from '../../persistence/interface/command-log.interface';
import { CommandLogRepository } from '../../persistence/repository/command-log.repository';
import { SimpleCommand } from './simple-command';

export class ContextAwareCommand {
    constructor(
        readonly taskId: string,
        readonly instanceId: string,
        readonly description: string,
        readonly createWrappedCommand: () => SimpleCommand, // TODO Replace with CommandType if possible.
        readonly processResult: (
            result: any,
        ) => Promise<void> = async (): Promise<void> => {},
    ) {}

    createCommandLog(
        commandLogRepository: CommandLogRepository,
    ): Promise<CommandLogInterface> {
        return commandLogRepository.create(
            this.taskId,
            this.instanceId,
            this.description,
        );
    }
}
