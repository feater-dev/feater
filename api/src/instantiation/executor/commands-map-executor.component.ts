import {CommandsMap} from './commands-map';
import {SimpleCommand} from './simple-command';
import {CommandsMapItem} from './commands-map-item';
import {Injectable} from '@nestjs/common';
import {CommandExecutorComponent} from './command-executor.component';

interface IdsMapType {
    [key: string]: boolean;
}

@Injectable()
export class CommandsMapExecutorComponent {

    private commandExecutorComponent: CommandExecutorComponent;

    setCommandExecutorComponent(commandExecutorComponent: CommandExecutorComponent): void {
        this.commandExecutorComponent = commandExecutorComponent;
    }

    execute(commandsMap: CommandsMap) {
        // TODO Validate map consistency beforehand.

        return new Promise(resolve => {
            this.executeNextBatch(commandsMap.items, resolve);
        });
    }

    protected executeNextBatch(
        commandsMapItems: CommandsMapItem[],
        resolve: () => void,
        completedCommandIds: IdsMapType = {},
        executingCommandIds: IdsMapType = {},
    ) {
        const pendingCommandsMapItems = this.getPendingCommandsMapItems(commandsMapItems, completedCommandIds, executingCommandIds);
        let anythingExecuted = false;

        if (0 === pendingCommandsMapItems.length) {
            resolve();

            return;
        }

        for (const pendingCommandsMapItem of pendingCommandsMapItems) {
            if (this.areAllCommandsCompleted(pendingCommandsMapItem.dependsOn, completedCommandIds)) {
                anythingExecuted = true;
                if (pendingCommandsMapItem.id) {
                    executingCommandIds[pendingCommandsMapItem.id] = true;
                }
                this.commandExecutorComponent
                    .execute(pendingCommandsMapItem.nestedCommand as SimpleCommand)
                    .then(() => {
                        if (pendingCommandsMapItem.id) {
                            delete executingCommandIds[pendingCommandsMapItem.id];
                            completedCommandIds[pendingCommandsMapItem.id] = true;
                        }
                        process.nextTick(() => {
                            this.executeNextBatch(commandsMapItems, resolve, completedCommandIds, executingCommandIds);
                        });
                    });
            }
        }

        if (!anythingExecuted && Object.keys(executingCommandIds).length === 0) {
            throw new Error('Inconsistent command dependencies.');
        }
    }

    protected getPendingCommandsMapItems(
        commandsMapItems: CommandsMapItem[],
        completedCommandIds: IdsMapType,
        executingCommandIds: IdsMapType,
    ): CommandsMapItem[] {
        return commandsMapItems.filter((commandMapItem: CommandsMapItem) => {
            return !completedCommandIds[commandMapItem.id] && !executingCommandIds[commandMapItem.id];
        });
    }

    protected areAllCommandsCompleted(
        commandIds: string[],
        completedCommandIds: IdsMapType,
    ): boolean {
        for (const commandId of commandIds) {
            if (!completedCommandIds[commandId]) {
                return false;
            }
        }

        return true;
    }
}