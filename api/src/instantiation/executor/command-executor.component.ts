import {SimpleCommandExecutorComponent} from './simple-command-executor.component';
import {ContextAwareCommandExecutorComponent} from './context-aware-command-executor-component.service';
import {CommandInterface} from './command.interface';
import {SimpleCommand} from './simple-command';
import {ContextAwareCommand} from './context-aware-command.interface';
import {ComplexCommand} from './complex-command.interface';
import {Injectable} from '@nestjs/common';

@Injectable()
export class CommandExecutorComponent {
    constructor(
        readonly simpleCommandExecutorComponent: SimpleCommandExecutorComponent,
        readonly wrappingCommandExecutorComponent: ContextAwareCommandExecutorComponent,
    ) {}

    async execute(command: CommandInterface, context: any): Promise<any> {
        if (command instanceof SimpleCommand) {
            await this.simpleCommandExecutorComponent.execute(command);

            return context;
        }

        if (command instanceof ContextAwareCommand) {
            await this.wrappingCommandExecutorComponent.execute(command, context);

            return context;
        }

        if (command instanceof ComplexCommand) {
            if (command.isParallelAllowed()) {
                await this.executeCommandsInParallel(command.children, context);
            } else {
                await this.executeCommandsInSequence(command.children, context);
            }

            return context;
        }

        throw new Error('Unknown class of command.');
    }

    protected async executeCommandsInSequence(commands: CommandInterface[], context: any): Promise<void> {
        for (const command of commands) {
            await this.execute(command, context);
        }
    }

    protected async executeCommandsInParallel(commands: CommandInterface[], context: any): Promise<void> {
        const promises = commands.map((command: CommandInterface): Promise<void> => {
            return this.execute(command, context);
        });

        await Promise.all(promises);
    }
}
