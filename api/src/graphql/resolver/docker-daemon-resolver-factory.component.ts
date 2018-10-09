import {Injectable} from '@nestjs/common';
import {ContainerStatusChecker} from '../../instantiation/container-status-checker.component';

@Injectable()
export class DockerDaemonResolverFactory {
    constructor(
        private readonly containerStatusChecker: ContainerStatusChecker,
    ) { }

    public getContainerStateResolver(containerNamePrefixExtractor?: (object: any) => string): (object: any) => Promise<string> {
        return async (object: any): Promise<string> => {
            return this.containerStatusChecker.check(containerNamePrefixExtractor(object));
        };
    }
}
