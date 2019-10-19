import { SimpleCommand } from '../../executor/simple-command';

export class ResetSourceCommand extends SimpleCommand {
    constructor(
        readonly cloneUrl: string,
        readonly referenceType: string,
        readonly referenceName: string,
        readonly sourceAbsoluteGuestPath: string,
    ) {
        super();
    }
}
