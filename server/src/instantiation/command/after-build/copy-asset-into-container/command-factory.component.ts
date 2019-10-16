import { AfterBuildTaskCommandFactoryInterface } from '../command-factory.interface';
import { CopyAssetIntoContainerCommand } from './command';
import { ActionExecutionContextAfterBuildTaskInterface } from '../../../action-execution-context/after-build/action-execution-context-after-build-task.interface';
import { ActionExecutionContext } from '../../../action-execution-context/action-execution-context';
import { ActionExecutionContextCopyAssetIntoContainerInterface } from '../../../action-execution-context/after-build/action-execution-context-copy-asset-into-container.interface';
import { ContextAwareCommand } from '../../../executor/context-aware-command.interface';
import { CommandType } from '../../../executor/command.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CopyAssetIntoContainerCommandFactoryComponent
    implements AfterBuildTaskCommandFactoryInterface {
    readonly TYPE = 'copy_asset_into_container';

    supportsType(type: string): boolean {
        return this.TYPE === type;
    }

    createCommand(
        type: string,
        afterBuildTask: ActionExecutionContextAfterBuildTaskInterface,
        taskId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstanceFromActionExecutionContext: () => Promise<void>,
    ): CommandType {
        const typedAfterBuildTask = afterBuildTask as ActionExecutionContextCopyAssetIntoContainerInterface;
        const taskIdDescriptionPart = typedAfterBuildTask.id
            ? ` \`${typedAfterBuildTask.id}\``
            : '';

        return new ContextAwareCommand(
            taskId,
            actionExecutionContext.id,
            `Running after build task${taskIdDescriptionPart} and copying asset \`${typedAfterBuildTask.assetId}\` for service \`${typedAfterBuildTask.serviceId}\``,
            () => {
                const service = actionExecutionContext.findService(
                    typedAfterBuildTask.serviceId,
                );

                return new CopyAssetIntoContainerCommand(
                    typedAfterBuildTask.serviceId,
                    typedAfterBuildTask.assetId,
                    typedAfterBuildTask.destinationPath,
                    service.containerId,
                    actionExecutionContext.paths.dir.absolute.guest,
                );
            },
        );
    }
}
