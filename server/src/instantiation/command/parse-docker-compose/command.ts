import {SimpleCommand} from '../../executor/simple-command';

export class ParseDockerComposeCommand extends SimpleCommand {

    constructor(
        readonly absoluteGuestComposeFilePaths: string[],
        readonly composeProjectName: string,
    ) {
        super();
    }

}
