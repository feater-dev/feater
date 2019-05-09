import {AfterBuildTaskCommandFactoryInterface} from '../command-factory.interface';
import {ExecuteServiceCmdCommand} from './command';
import {InstanceContextAfterBuildTaskInterface} from '../../../instance-context/after-build/instance-context-after-build-task.interface';
import {InstanceContext} from '../../../instance-context/instance-context';
import {InstanceContextExecuteServiceCmdInterface} from '../../../instance-context/after-build/instance-context-execute-service-cmd.Interface';
import {ContextAwareCommand} from '../../../executor/context-aware-command.interface';
import {EnvVariablesSet} from '../../../sets/env-variables-set';
import {CommandType} from '../../../executor/command.type';
import {Injectable} from '@nestjs/common';

@Injectable()
export class ExecuteServiceCmdCommandFactoryComponent implements AfterBuildTaskCommandFactoryInterface {

    protected readonly TYPE = 'executeServiceCommand';

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
        const typedAfterBuildTask = afterBuildTask as InstanceContextExecuteServiceCmdInterface;
        const taskIdDescriptionPart = typedAfterBuildTask.id
            ? ` \`${typedAfterBuildTask.id}\``
            : '';

        return new ContextAwareCommand(
            taskId,
            instanceContext.id,
            `Running after build task${taskIdDescriptionPart} and executing service command for service \`${typedAfterBuildTask.serviceId}\``,
            () => {
                const service = instanceContext.findService(typedAfterBuildTask.serviceId);

                return new ExecuteServiceCmdCommand(
                    instanceContext.envVariables,
                    EnvVariablesSet.fromList(typedAfterBuildTask.customEnvVariables),
                    typedAfterBuildTask.inheritedEnvVariables,
                    service.containerId,
                    typedAfterBuildTask.command,
                    instanceContext.paths.dir.absolute.guest,
                );
            },
        );
    }

}
