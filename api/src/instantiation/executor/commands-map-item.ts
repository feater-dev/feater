import {CommandType} from './command.type';

export class CommandsMapItem {
    constructor(
        readonly nestedCommand: CommandType,
        readonly id?: string,
        readonly dependsOn: string[] = [],
    ) {}
}
