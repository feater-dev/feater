import {Injectable} from '@nestjs/common';
import {InterpolationHelper} from '../../../helper/interpolation-helper.component';
import {SimpleCommandExecutorComponentInterface} from '../../../executor/simple-command-executor-component.interface';
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

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as InterpolateFileCommand;
        const commandLogger = typedCommand.commandLogger;

        const interpolatedText = this.interpolationHelper.interpolateFile(
            typedCommand.absoluteGuestPath,
            typedCommand.featerVariables,
        );

        commandLogger.info(`Interpolated text:\n${interpolatedText}`);

        return {interpolatedText} as InterpolateFileCommandResultInterface;
    }

}
