import {SimpleCommand} from '../../executor/simple-command';

export class ParseDockerComposeCommand extends SimpleCommand {

    readonly NAME = 'parse_docker_compose';

    constructor(
        readonly absoluteGuestComposeFilePaths: string[], // Relative to absoluteGuestSourcePath.
        readonly composeProjectName: string,
    ) {
        super();
    }

}
