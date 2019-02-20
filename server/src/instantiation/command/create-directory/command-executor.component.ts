import * as fs from 'fs-extra';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {CreateDirectoryCommand} from './command';

@Injectable()
export class CreateDirectoryCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof CreateDirectoryCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as CreateDirectoryCommand;
        typedCommand.commandLogger.info(`Absolute guest path: ${typedCommand.absoluteGuestDirPath}`);
        fs.mkdirSync(typedCommand.absoluteGuestDirPath);

        return {};
    }

}
