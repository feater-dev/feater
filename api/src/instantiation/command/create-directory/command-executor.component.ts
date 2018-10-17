import * as fs from 'fs-extra';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {CreateDirectoryCommand} from './command';

@Injectable()
export class CreateDirectoryCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof CreateDirectoryCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as CreateDirectoryCommand;

        return new Promise(resolve => {
            fs.mkdirSync(typedCommand.absoluteGuestDirPath);

            resolve({});
        });
    }

}
