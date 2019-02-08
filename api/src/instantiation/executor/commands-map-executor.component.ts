import * as _ from 'lodash';
import {Injectable} from '@nestjs/common';
import {CommandsMap} from './commands-map';
import {SimpleCommand} from './simple-command';
import {CommandsMapItem} from './commands-map-item';
import {CommandExecutorComponent} from './command-executor.component';
import {CommandType} from './command.type';

@Injectable()
export class CommandsMapExecutorComponent {

    private commandExecutorComponent: CommandExecutorComponent;

    setCommandExecutorComponent(commandExecutorComponent: CommandExecutorComponent): void {
        this.commandExecutorComponent = commandExecutorComponent;
    }

    execute(commandsMap: CommandsMap): Promise<void> {
        // TODO Validate map consistency beforehand.

        const completedCommandIds = [];
        const executingCommandSymbols = [];
        const pendingCommandSymbols = commandsMap.items.map(
            (commandMapItem: CommandsMapItem) => commandMapItem.symbol,
        );

        return new Promise((resolve, reject) => {
            try {
                this.executeNextBatch(
                    commandsMap.items,
                    resolve,
                    reject,
                    completedCommandIds,
                    executingCommandSymbols,
                    pendingCommandSymbols,
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    protected executeNextBatch(
        commandsMapItems: CommandsMapItem[],
        resolve: (value?: void | PromiseLike<void>) => void,
        reject: (reason?: any) => void,
        completedCommandIds: string[],
        executingCommandSymbols: symbol[],
        pendingCommandSymbols: symbol[],
    ) {

        if (0 === pendingCommandSymbols.length && 0 === executingCommandSymbols.length) {
            resolve();

            return;
        }

        let anythingExecuted = false;

        for (const commandMapItem of commandsMapItems) {
            if (
                -1 === pendingCommandSymbols.indexOf(commandMapItem.symbol)
                || -1 !== executingCommandSymbols.indexOf(commandMapItem.symbol)
                || _.difference(commandMapItem.dependsOn, completedCommandIds).length !== 0
            ) {
                continue;
            }

            anythingExecuted = true;
            _.pull(pendingCommandSymbols, commandMapItem.symbol);
            executingCommandSymbols.push(commandMapItem.symbol);

            this.commandExecutorComponent
                .execute(commandMapItem.nestedCommand as CommandType)
                .then(
                    () => {
                        _.pull(executingCommandSymbols, commandMapItem.symbol);
                        if (commandMapItem.id) {
                            completedCommandIds.push(commandMapItem.id);
                        }
                        process.nextTick(() => {
                            this.executeNextBatch(
                                commandsMapItems,
                                resolve,
                                reject,
                                completedCommandIds,
                                executingCommandSymbols,
                                pendingCommandSymbols,
                            );
                        });
                    },
                    (error) => {
                        reject(error);
                    },
                );
        }

        if (
            !anythingExecuted
            && 0 === pendingCommandSymbols.length
            && 0 === executingCommandSymbols.length
        ) {
            throw new Error('Inconsistent command dependencies.');
        }
    }

}
