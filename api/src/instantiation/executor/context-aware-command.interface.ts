import {CommandInterface} from './command.interface';
import {SimpleCommand} from './simple-command';

export class ContextAwareCommand implements CommandInterface {
    constructor(
        readonly wrapCommand: (context: any) => SimpleCommand,
        readonly processResult: (result: any, context: any) => void = () => {},
    ) {}
}
