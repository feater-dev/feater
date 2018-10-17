import {CommandInterface} from '../../executor/command.interface';
import {InstanceContext} from '../../instance-context/instance-context';
import {InstanceContextAfterBuildTaskInterface} from '../../instance-context/after-build/instance-context-after-build-task.interface';

export interface AfterBuildTaskCommandFactoryInterface {

    supportsType(type: string): boolean;

    createCommand(
        type: string,
        afterBuildTask: InstanceContextAfterBuildTaskInterface,
        instanceContext: InstanceContext,
    ): CommandInterface;

}
