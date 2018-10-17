import {SimpleCommand} from '../executor/simple-command';

export interface SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean;

    execute(command: SimpleCommand): Promise<any>;

}
