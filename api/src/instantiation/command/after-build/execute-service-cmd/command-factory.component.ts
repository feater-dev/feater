import {AfterBuildTaskCommandFactoryInterface} from '../command-factory.interface';
import {CommandInterface} from '../../../executor/command.interface';
import {ExecuteServiceCmdCommand} from './command';
import {InstanceContextAfterBuildTaskInterface} from '../../../instance-context/after-build/instance-context-after-build-task.interface';
import {InstanceContext} from '../../../instance-context/instance-context';
import {InstanceContextExecuteServiceCmdInterface} from '../../../instance-context/after-build/instance-context-execute-service-cmd.Interface';
import {ContextAwareCommand} from '../../../executor/context-aware-command.interface';
import {EnvVariablesSet} from '../../../sets/env-variables-set';

export class ExecuteServiceCmdCommandFactoryComponent implements AfterBuildTaskCommandFactoryInterface {

    protected readonly TYPE = 'executeServiceCommand';

    supportsType(type: string): boolean {
        return this.TYPE === type;
    }

    createCommand(
        type: string,
        afterBuildTask: InstanceContextAfterBuildTaskInterface,
        instanceContext: InstanceContext,
    ): CommandInterface {
        const typedAfterBuildTask = afterBuildTask as InstanceContextExecuteServiceCmdInterface;

        return new ContextAwareCommand(
            `Execute service command for service \`${typedAfterBuildTask.serviceId}\``,
            (instanceContext: InstanceContext) => {
                const service = instanceContext.findService(typedAfterBuildTask.serviceId);

                return new ExecuteServiceCmdCommand(
                    EnvVariablesSet.fromList(instanceContext.envVariables),
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
