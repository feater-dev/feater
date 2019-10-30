import { AfterBuildTaskCommandFactoryInterface } from '../command-factory.interface';
import { ExecuteServiceCmdCommand } from './command';
import { ActionExecutionContextAfterBuildTaskInterface } from '../../../action-execution-context/after-build/action-execution-context-after-build-task.interface';
import { ActionExecutionContext } from '../../../action-execution-context/action-execution-context';
import { ActionExecutionContextExecuteServiceCmdInterface } from '../../../action-execution-context/after-build/action-execution-context-execute-service-cmd.Interface';
import { ContextAwareCommand } from '../../../executor/context-aware-command.interface';
import { EnvVariablesSet } from '../../../sets/env-variables-set';
import { CommandType } from '../../../executor/command.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExecuteServiceCmdCommandFactoryComponent
    implements AfterBuildTaskCommandFactoryInterface {
    private readonly TYPE = 'execute_service_command';

    supportsType(type: string): boolean {
        return this.TYPE === type;
    }

    createCommand(
        type: string,
        afterBuildTask: ActionExecutionContextAfterBuildTaskInterface,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstanceFromActionExecutionContext: () => Promise<void>,
    ): CommandType {
        const typedAfterBuildTask = afterBuildTask as ActionExecutionContextExecuteServiceCmdInterface;
        const taskIdDescriptionPart = typedAfterBuildTask.id
            ? ` \`${typedAfterBuildTask.id}\``
            : '';

        return new ContextAwareCommand(
            actionLogId,
            actionExecutionContext.id,
            actionExecutionContext.hash,
            `Running after build task${taskIdDescriptionPart} and executing service command for service \`${typedAfterBuildTask.serviceId}\``,
            () => {
                const service = actionExecutionContext.findService(
                    typedAfterBuildTask.serviceId,
                );

                return new ExecuteServiceCmdCommand(
                    actionExecutionContext.envVariables,
                    EnvVariablesSet.fromList(
                        typedAfterBuildTask.customEnvVariables,
                    ),
                    typedAfterBuildTask.inheritedEnvVariables,
                    service.containerId,
                    typedAfterBuildTask.command,
                    actionExecutionContext.paths.absolute.guest,
                );
            },
        );
    }
}
