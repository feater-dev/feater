import * as fs from 'fs-extra';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../simple-command-executor-component.interface';
import {CopyFileCommand} from './command';
import {SimpleCommand} from '../../../executor/simple-command';

@Injectable()
export class CopyFileCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    supports(command: SimpleCommand): boolean {
        return (command instanceof CopyFileCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as CopyFileCommand;

        return new Promise(resolve => {
            fs.copySync(
                typedCommand.absoluteGuestSourcePath,
                typedCommand.absoluteGuestDestinationPath,
            );

            resolve({});
        });
    }

}
