import {AfterBuildTaskCommandFactoryInterface} from '../command-factory.interface';
import {CopyAssetIntoContainerCommand} from './command';
import {InstanceContextAfterBuildTaskInterface} from '../../../instance-context/after-build/instance-context-after-build-task.interface';
import {InstanceContext} from '../../../instance-context/instance-context';
import {InstanceContextCopyAssetIntoContainerInterface} from '../../../instance-context/after-build/instance-context-copy-asset-into-container.interface';
import {ContextAwareCommand} from '../../../executor/context-aware-command.interface';
import {CommandType} from '../../../executor/command.type';
import {Injectable} from '@nestjs/common';

@Injectable()
export class CopyAssetIntoContainerCommandFactoryComponent implements AfterBuildTaskCommandFactoryInterface {

    protected readonly TYPE = 'copyAssetIntoContainer';

    supportsType(type: string): boolean {
        return this.TYPE === type;
    }

    createCommand(
        type: string,
        afterBuildTask: InstanceContextAfterBuildTaskInterface,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): CommandType {
        const typedAfterBuildTask = afterBuildTask as InstanceContextCopyAssetIntoContainerInterface;
        const taskIdDescriptionPart = typedAfterBuildTask.id
            ? ` \`${typedAfterBuildTask.id}\``
            : '';

        return new ContextAwareCommand(
            taskId,
            instanceContext.id,
            `Running after build task${taskIdDescriptionPart} and copying asset \`${typedAfterBuildTask.assetId}\` for service \`${typedAfterBuildTask.serviceId}\``,
            () => {
                const service = instanceContext.findService(typedAfterBuildTask.serviceId);

                return new CopyAssetIntoContainerCommand(
                    typedAfterBuildTask.serviceId,
                    typedAfterBuildTask.assetId,
                    typedAfterBuildTask.destinationPath,
                    service.containerId,
                    instanceContext.paths.dir.absolute.guest,
                );
            },
        );
    }

}
