import {Injectable} from '@nestjs/common';
import {FeaterVariablesHelper} from './feater-variables-helper';
import {EnvVariablesSet} from '../sets/env-variables-set';
import {VariablesContextInterface} from './variables-context.interface';

@Injectable()
export class EnvVariablesHelper {

    constructor(
        protected featerVariableHelper: FeaterVariablesHelper,
    ) {}

    getVariables(context: VariablesContextInterface): EnvVariablesSet {
        const envVariables = new EnvVariablesSet();
        const featerVariables = this.featerVariableHelper.getVariables(context);
        for (const featerVariable of featerVariables.toList()) {
            envVariables.add(
                `FEATER__${featerVariable.name.toUpperCase()}`,
                featerVariable.value,
            );
        }

        return envVariables;
    }

}
