import {CommandInterface} from './command.interface';
import {SimpleCommand} from './simple-command';
import {CommandLogInterface} from '../../persistence/interface/command-log.interface';
import {CommandLogRepository} from '../../persistence/repository/command-log.repository';

export class ContextAwareCommand implements CommandInterface {
    constructor(
        readonly description: string,
        readonly createWrappedCommand: (context: any) => SimpleCommand,
        readonly processResult: (result: any, context: any) => void = () => {},
    ) {}

    createCommandLog(context: any, commandLogRepository: CommandLogRepository): Promise<CommandLogInterface> {
        return commandLogRepository.create('instance_creation', context.id, context.hash, this.description);
    }
}
