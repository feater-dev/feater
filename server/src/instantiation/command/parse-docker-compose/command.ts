import { SimpleCommand } from '../../executor/simple-command';
import { EnvVariablesSet } from '../../sets/env-variables-set';

export class ParseDockerComposeCommand extends SimpleCommand {
    constructor(
        readonly sourceId: string,
        readonly sourceAbsoluteGuestPath: string,
        readonly envDirRelativePath: string,
        readonly composeFileRelativePaths: string[],
        readonly envVariables: EnvVariablesSet,
        readonly composeProjectName: string,
        readonly workingDirectory: string,
    ) {
        super();
    }
}
