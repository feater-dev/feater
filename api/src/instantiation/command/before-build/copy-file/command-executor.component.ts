import * as fs from 'fs-extra';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../../executor/simple-command-executor-component.interface';
import {CopyFileCommand} from './command';
import {SimpleCommand} from '../../../executor/simple-command';

@Injectable()
export class CopyFileCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof CopyFileCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as CopyFileCommand;
        const logger = typedCommand.commandLogger;

        logger.info(`Absolute guest source path: ${typedCommand.absoluteGuestSourcePath}`);
        logger.info(`Absolute guest destination path: ${typedCommand.absoluteGuestDestinationPath}`);

        fs.copySync(
            typedCommand.absoluteGuestSourcePath,
            typedCommand.absoluteGuestDestinationPath,
        );

        return {};
    }

}
