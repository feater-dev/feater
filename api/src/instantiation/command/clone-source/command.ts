import {SimpleCommand} from '../../executor/simple-command';

export class CloneSourceCommand extends SimpleCommand {

    readonly NAME = 'clone_source';

    constructor(
        readonly cloneUrl: string,
        readonly referenceType: string,
        readonly referenceName: string,
        readonly absoluteGuestInstanceDirPath: string,
    ) {
        super();
    }

}
