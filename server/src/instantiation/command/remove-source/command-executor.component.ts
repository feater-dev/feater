import * as rimraf from 'rimraf';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {RemoveSourceCommand} from './command';

@Injectable()
export class RemoveSourceCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof RemoveSourceCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as RemoveSourceCommand;
        const commandLogger = typedCommand.commandLogger;

        commandLogger.info(`Source ID: ${typedCommand.sourceId}`);
        commandLogger.info(`Source absolute guest path: ${typedCommand.sourceAbsoluteGuestPath}`);

        commandLogger.info(`Removing source.`);
        rimraf.sync(typedCommand.sourceAbsoluteGuestPath);

        return {};
    }

}
