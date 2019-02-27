import {SimpleCommand} from '../../../executor/simple-command';

export class CopyFileCommand extends SimpleCommand {

    constructor(
        readonly absoluteGuestSourcePath: string,
        readonly absoluteGuestDestinationPath: string,
    ) {
        super();
    }

}
