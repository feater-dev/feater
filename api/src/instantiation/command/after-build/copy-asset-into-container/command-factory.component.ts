import {AfterBuildTaskCommandFactoryInterface} from '../command-factory.interface';
import {CommandInterface} from '../../../executor/command.interface';
import {CopyAssetIntoContainerCommand} from './command';
import {InstanceContextAfterBuildTaskInterface} from '../../../instance-context/after-build/instance-context-after-build-task.interface';
import {InstanceContext} from '../../../instance-context/instance-context';
import {InstanceContextCopyAssetIntoContainerInterface} from '../../../instance-context/after-build/instance-context-copy-asset-into-container.interface';
import {ContextAwareCommand} from '../../../executor/context-aware-command.interface';

export class CopyAssetIntoContainerCommandFactoryComponent implements AfterBuildTaskCommandFactoryInterface {

    protected readonly TYPE = 'copyAssetIntoContainer';

    supportsType(type: string): boolean {
        return this.TYPE === type;
    }

    createCommand(
        type: string,
        afterBuildTask: InstanceContextAfterBuildTaskInterface,
        instanceContext: InstanceContext,
    ): CommandInterface {
        const typedAfterBuildTask = afterBuildTask as InstanceContextCopyAssetIntoContainerInterface;

        return new ContextAwareCommand(
            (instanceContext: InstanceContext) => {
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
