import {CommandType} from './command.type';

export class CommandsList {

    constructor(
        readonly commands: CommandType[],
        readonly allowParallel = true,
    ) {
        this.commands = commands;
        this.allowParallel = allowParallel;
    }

    isParallelAllowed(): boolean {
        return this.allowParallel;
    }

    addCommand(command: CommandType): void {
        this.commands.push(command);
    }

}
