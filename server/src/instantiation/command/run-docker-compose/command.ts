import {EnvVariablesSet} from '../../sets/env-variables-set';
import {SimpleCommand} from '../../executor/simple-command';

export class RunDockerComposeCommand extends SimpleCommand {

    constructor(
        readonly absoluteGuestEnvDirPath: string,
        readonly absoluteGuestComposeFilePaths: string[],
        readonly composeProjectName: string,
        readonly envVariables: EnvVariablesSet,
    ) {
        super();
    }

}
