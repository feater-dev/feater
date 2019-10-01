import * as fs from 'fs-extra';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { SimpleCommand } from '../../executor/simple-command';
import { CreateDirectoryCommand } from './command';

@Injectable()
export class CreateDirectoryCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    supports(command: SimpleCommand): boolean {
        return command instanceof CreateDirectoryCommand;
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            absoluteGuestDirPath,
            commandLogger,
        } = command as CreateDirectoryCommand;

        commandLogger.info(`Absolute guest path: ${absoluteGuestDirPath}`);
        fs.mkdirSync(absoluteGuestDirPath);
        fs.mkdirSync(path.join(absoluteGuestDirPath, 'source'));

        return {};
    }
}
