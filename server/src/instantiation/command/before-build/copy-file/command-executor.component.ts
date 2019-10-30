import * as fs from 'fs-extra';
import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from '../../../executor/simple-command-executor-component.interface';
import { CopyFileCommand } from './command';
import { SimpleCommand } from '../../../executor/simple-command';

@Injectable()
export class CopyFileCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    supports(command: SimpleCommand): boolean {
        return command instanceof CopyFileCommand;
    }

    async execute(command: SimpleCommand): Promise<unknown> {
        const {
            absoluteGuestSourcePath,
            absoluteGuestDestinationPath,
            commandLogger,
        } = command as CopyFileCommand;

        commandLogger.info(
            `Absolute guest source path: ${absoluteGuestSourcePath}`,
        );
        commandLogger.info(
            `Absolute guest destination path: ${absoluteGuestDestinationPath}`,
        );

        fs.copySync(absoluteGuestSourcePath, absoluteGuestDestinationPath);

        return {};
    }
}
