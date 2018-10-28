import {Injectable} from '@nestjs/common';
import {InterpolationHelper} from '../../../helper/interpolation-helper.component';
import {SimpleCommandExecutorComponentInterface} from '../../simple-command-executor-component.interface';
import {SimpleCommand} from '../../../executor/simple-command';
import {InterpolateFileCommand} from './command';
import {InterpolateFileCommandResultInterface} from './command-result.interface';

@Injectable()
export class InterpolateFileCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly interpolationHelper: InterpolationHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof InterpolateFileCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as InterpolateFileCommand;

        return new Promise(resolve => {
            const interpolatedText = this.interpolationHelper.interpolateFile(
                typedCommand.absoluteGuestPath,
                typedCommand.featerVariables,
            );

            resolve({interpolatedText} as InterpolateFileCommandResultInterface);
        });
    }
}
