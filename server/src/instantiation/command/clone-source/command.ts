import { SimpleCommand } from '../../executor/simple-command';

export class CloneSourceCommand extends SimpleCommand {
    constructor(
        readonly sourceId: string,
        readonly cloneUrl: string,
        readonly useDeployKey: boolean,
        readonly referenceType: string,
        readonly referenceName: string,
        readonly sourceAbsoluteGuestPath: string,
        readonly sourceAbsoluteHostPath: string,
        readonly workingDirectory: string,
    ) {
        super();
    }
}
