import { SimpleCommand } from '../../executor/simple-command';

export class CreateDirectoryCommand extends SimpleCommand {
    constructor(readonly absoluteGuestDirPath: string) {
        super();
    }
}
