import { SimpleCommand } from '../../executor/simple-command';

export class RemoveSourceCommand extends SimpleCommand {
    constructor(
        readonly sourceId: string,
        readonly sourceAbsoluteGuestPath: string,
    ) {
        super();
    }
}
