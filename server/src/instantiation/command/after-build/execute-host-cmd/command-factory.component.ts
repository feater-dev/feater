import {AfterBuildTaskCommandFactoryInterface} from '../command-factory.interface';
import {ExecuteHostCmdCommand} from './command';
import {InstanceContextAfterBuildTaskInterface} from '../../../instance-context/after-build/instance-context-after-build-task.interface';
import {InstanceContext} from '../../../instance-context/instance-context';
import {InstanceContextExecuteHostCmdInterface} from '../../../instance-context/after-build/instance-context-execute-host-cmd.Interface';
import {ContextAwareCommand} from '../../../executor/context-aware-command.interface';
import {EnvVariablesSet} from '../../../sets/env-variables-set';
import {CommandType} from '../../../executor/command.type';
import {Injectable} from '@nestjs/common';

@Injectable()
export class ExecuteHostCmdCommandFactoryComponent implements AfterBuildTaskCommandFactoryInterface {

    protected readonly TYPE = 'executeHostCommand';

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
        const typedAfterBuildTask = afterBuildTask as InstanceContextExecuteHostCmdInterface;

        return new ContextAwareCommand(
            taskId,
            instanceContext.id,
            `Execute host command`,
            () => new ExecuteHostCmdCommand(
                instanceContext.envVariables,
                EnvVariablesSet.fromList(typedAfterBuildTask.customEnvVariables),
                typedAfterBuildTask.inheritedEnvVariables,
                typedAfterBuildTask.command,
                instanceContext.paths.dir.absolute.guest,
            ),
        );
    }

}
