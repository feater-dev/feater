import * as rimraf from 'rimraf';
import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { SimpleCommand } from '../../executor/simple-command';
import { RemoveSourceCommand } from './command';

@Injectable()
export class RemoveSourceCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    supports(command: SimpleCommand): boolean {
        return command instanceof RemoveSourceCommand;
    }

    async execute(command: SimpleCommand): Promise<unknown> {
        const {
            sourceId,
            sourceAbsoluteGuestPath,
            commandLogger,
        } = command as RemoveSourceCommand;

        commandLogger.info(`Source ID: ${sourceId}`);
        commandLogger.info(
            `Source absolute guest path: ${sourceAbsoluteGuestPath}`,
        );

        commandLogger.info(`Removing source.`);
        rimraf.sync(sourceAbsoluteGuestPath);

        return {};
    }
}
