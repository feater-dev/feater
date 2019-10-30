import { ActionExecutionContextAfterBuildTaskInterface } from './action-execution-context-after-build-task.interface';
import { InheritedEnvVariableInterface } from '../../command/after-build/inherited-env-variable.interface';
import { CustomEnvVariableInterface } from '../../command/after-build/custom-env-variable.interface';

export interface ActionExecutionContextExecuteServiceCmdInterface
    extends ActionExecutionContextAfterBuildTaskInterface {
    readonly customEnvVariables: CustomEnvVariableInterface[];
    readonly inheritedEnvVariables: InheritedEnvVariableInterface[];
    readonly serviceId: string;
    readonly command: string[];
    readonly absoluteGuestInstancePath: string;
}
