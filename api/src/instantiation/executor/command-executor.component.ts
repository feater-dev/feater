import {ContextAwareCommandExecutorComponent} from './context-aware-command-executor.component';
import {SimpleCommand} from './simple-command';
import {ContextAwareCommand} from './context-aware-command.interface';
import {CommandsList} from './commands-list';
import {CommandType} from './command.type';
import {CommandsListExecutorComponent} from './commands-list-executor.component';
import {CommandsMapExecutorComponent} from './commands-map-executor.component';
import {CommandsMap} from './commands-map';
import {CompositeSimpleCommandExecutorComponent} from './composite-simple-command-executor.component';
import {Injectable} from '@nestjs/common';

@Injectable()
export class CommandExecutorComponent {

    constructor(
        readonly compositeSimpleCommandExecutorComponent: CompositeSimpleCommandExecutorComponent,
        readonly contextAwareCommandExecutorComponent: ContextAwareCommandExecutorComponent,
        readonly commandsListExecutorComponent: CommandsListExecutorComponent,
        readonly commandsMapExecutorComponent: CommandsMapExecutorComponent,
    ) {
        this.contextAwareCommandExecutorComponent.setCommandExecutorComponent(this);
        this.commandsListExecutorComponent.setCommandExecutorComponent(this);
        this.commandsMapExecutorComponent.setCommandExecutorComponent(this);
    }

    execute(command: CommandType): Promise<any> {
        if (command instanceof SimpleCommand) {
            return this.compositeSimpleCommandExecutorComponent.execute(command);
        }

        if (command instanceof ContextAwareCommand) {
            return this.contextAwareCommandExecutorComponent.execute(command);
        }

        if (command instanceof CommandsList) {
            return this.commandsListExecutorComponent.execute(command);
        }

        if (command instanceof CommandsMap) {
            return this.commandsMapExecutorComponent.execute(command);
        }

        throw new Error('Unknown class of command.');
    }

}
