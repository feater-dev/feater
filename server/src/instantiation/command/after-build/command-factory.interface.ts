import { ActionExecutionContext } from '../../action-execution-context/action-execution-context';
import { ActionExecutionContextAfterBuildTaskInterface } from '../../action-execution-context/after-build/action-execution-context-after-build-task.interface';
import { CommandType } from '../../executor/command.type';

export interface AfterBuildTaskCommandFactoryInterface {
    supportsType(type: string): boolean;

    createCommand(
        type: string,
        afterBuildTask: ActionExecutionContextAfterBuildTaskInterface,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstanceFromActionExecutionContext: () => Promise<void>,
    ): CommandType;
}
