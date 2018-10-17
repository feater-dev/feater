import {CommandInterface} from '../../executor/command.interface';
import {InstanceContextBeforeBuildTaskInterface} from '../../instance-context/before-build/instance-context-before-build-task.interface';
import {InstanceContext} from '../../instance-context/instance-context';
import {InstanceContextSourceInterface} from '../../instance-context/instance-context-source.interface';

export interface BeforeBuildTaskCommandFactoryInterface {

    supportsType(type: string): boolean;

    createCommand(
        type: string,
        beforeBuildTask: InstanceContextBeforeBuildTaskInterface,
        source: InstanceContextSourceInterface,
        instance: InstanceContext,
    ): CommandInterface;

}
