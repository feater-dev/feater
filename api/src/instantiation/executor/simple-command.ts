import {CommandInterface} from './command.interface';
import {CommandLogger} from '../logger/command-logger';

export class SimpleCommand implements CommandInterface {
    commandLogger: CommandLogger;
}
