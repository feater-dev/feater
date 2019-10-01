import { CommandType } from './command.type';

export class CommandsMapItem {
    readonly symbol: symbol;

    constructor(
        readonly nestedCommand: CommandType,
        readonly id?: string,
        readonly dependsOn: string[] = [],
    ) {
        this.symbol = Symbol();
    }
}
