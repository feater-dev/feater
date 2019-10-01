import { InstanceContextBeforeBuildTaskInterface } from '../../instance-context/before-build/instance-context-before-build-task.interface';
import { InstanceContext } from '../../instance-context/instance-context';
import { InstanceContextSourceInterface } from '../../instance-context/instance-context-source.interface';
import { CommandType } from '../../executor/command.type';

export interface BeforeBuildTaskCommandFactoryInterface {
    supportsType(type: string): boolean;

    createCommand(
        type: string,
        beforeBuildTask: InstanceContextBeforeBuildTaskInterface,
        source: InstanceContextSourceInterface,
        taskId: string,
        instance: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): CommandType;
}
