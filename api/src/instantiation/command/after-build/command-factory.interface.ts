import {InstanceContext} from '../../instance-context/instance-context';
import {InstanceContextAfterBuildTaskInterface} from '../../instance-context/after-build/instance-context-after-build-task.interface';
import {CommandType} from '../../executor/command.type';

export interface AfterBuildTaskCommandFactoryInterface {

    supportsType(type: string): boolean;

    createCommand(
        type: string,
        afterBuildTask: InstanceContextAfterBuildTaskInterface,
        taskId: string,
        instanceContext: InstanceContext,
    ): CommandType;

}
