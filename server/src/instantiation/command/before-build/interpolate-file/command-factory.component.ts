import * as path from 'path';
import { BeforeBuildTaskCommandFactoryInterface } from '../command-factory.interface';
import { InterpolateFileCommand } from './command';
import { ContextAwareCommand } from '../../../executor/context-aware-command.interface';
import { InterpolateFileCommandResultInterface } from './command-result.interface';
import { ActionExecutionContextBeforeBuildTaskInterface } from '../../../action-execution-context/before-build/action-execution-context-before-build-task.interface';
import { ActionExecutionContextSourceInterface } from '../../../action-execution-context/action-execution-context-source.interface';
import { ActionExecutionContext } from '../../../action-execution-context/action-execution-context';
import { ActionExecutionContextInterpolateFileInterface } from '../../../action-execution-context/before-build/action-execution-context-interpolate-file.interface';
import { CommandType } from '../../../executor/command.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InterpolateFileCommandFactoryComponent
    implements BeforeBuildTaskCommandFactoryInterface {
    private readonly TYPE = 'interpolate';

    supportsType(type: string): boolean {
        return this.TYPE === type;
    }

    createCommand(
        type: string,
        beforeBuildTask: ActionExecutionContextBeforeBuildTaskInterface,
        source: ActionExecutionContextSourceInterface,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstanceFromActionExecutionContext: () => Promise<void>,
    ): CommandType {
        const typedBeforeBuildTask = beforeBuildTask as ActionExecutionContextInterpolateFileInterface;

        return new ContextAwareCommand(
            actionLogId,
            actionExecutionContext.id,
            actionExecutionContext.hash,
            `Interpolate file for source \`${source.id}\``,
            () =>
                new InterpolateFileCommand(
                    actionExecutionContext.featerVariables,
                    path.join(
                        source.paths.absolute.guest,
                        typedBeforeBuildTask.relativePath,
                    ),
                ),
            async (
                result: InterpolateFileCommandResultInterface,
            ): Promise<void> => {
                (beforeBuildTask as ActionExecutionContextInterpolateFileInterface).interpolatedText =
                    result.interpolatedText;
            },
        );
    }
}
