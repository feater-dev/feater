import * as path from 'path';
import { BeforeBuildTaskCommandFactoryInterface } from '../command-factory.interface';
import { CopyFileCommand } from './command';
import { ContextAwareCommand } from '../../../executor/context-aware-command.interface';
import { ActionExecutionContextBeforeBuildTaskInterface } from '../../../action-execution-context/before-build/action-execution-context-before-build-task.interface';
import { ActionExecutionContextSourceInterface } from '../../../action-execution-context/action-execution-context-source.interface';
import { ActionExecutionContext } from '../../../action-execution-context/action-execution-context';
import { ActionExecutionContextCopyFileInterface } from '../../../action-execution-context/before-build/action-execution-context-copy-file.interface';
import { CommandType } from '../../../executor/command.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CopyFileCommandFactoryComponent
    implements BeforeBuildTaskCommandFactoryInterface {
    private readonly TYPE = 'copy';

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
        const typedBeforeBuildTask = beforeBuildTask as ActionExecutionContextCopyFileInterface;

        return new ContextAwareCommand(
            actionLogId,
            actionExecutionContext.id,
            actionExecutionContext.hash,
            `Copy file for source \`${source.id}\``,
            () =>
                new CopyFileCommand(
                    path.join(
                        source.paths.absolute.guest,
                        typedBeforeBuildTask.sourceRelativePath,
                    ),
                    path.join(
                        source.paths.absolute.guest,
                        typedBeforeBuildTask.destinationRelativePath,
                    ),
                ),
        );
    }
}
