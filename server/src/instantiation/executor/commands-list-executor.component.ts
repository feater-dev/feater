import { CommandsList } from './commands-list';
import { Injectable } from '@nestjs/common';
import { CommandType } from './command.type';
import { CommandExecutorComponent } from './command-executor.component';

@Injectable()
export class CommandsListExecutorComponent {
    private commandExecutorComponent: CommandExecutorComponent;

    setCommandExecutorComponent(
        commandExecutorComponent: CommandExecutorComponent,
    ): void {
        this.commandExecutorComponent = commandExecutorComponent;
    }

    async execute(command: CommandsList): Promise<void> {
        if (command.isParallelAllowed()) {
            await this.executeCommandsInParallel(command.commands);
        } else {
            await this.executeCommandsInSequence(command.commands);
        }
    }

    private async executeCommandsInSequence(
        commands: CommandType[],
    ): Promise<void> {
        for (const command of commands) {
            await this.commandExecutorComponent.execute(command);
        }
    }

    private async executeCommandsInParallel(
        commands: CommandType[],
    ): Promise<void> {
        const promises = commands.map(
            (command: CommandType): Promise<void> => {
                return this.commandExecutorComponent.execute(command);
            },
        );

        await Promise.all(promises);
    }
}
