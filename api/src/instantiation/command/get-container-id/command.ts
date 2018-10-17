import {SimpleCommand} from '../../executor/simple-command';

export interface ServiceContainerNamePrefixInterface {
    readonly serviceId: string;
    readonly containerNamePrefix: string;
}

export class GetContainerIdsCommand extends SimpleCommand {

    constructor(
        readonly composeProjectName: string,
        readonly serviceContainerNamePrefixes: ServiceContainerNamePrefixInterface[],
    ) {
        super();
    }

}
