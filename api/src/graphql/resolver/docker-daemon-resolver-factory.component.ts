import {Injectable} from '@nestjs/common';
import {ContainerStatusCheckerComponent} from '../../instantiation/container-status-checker.component';

@Injectable()
export class DockerDaemonResolverFactory {
    constructor(
        private readonly containerStatusChecker: ContainerStatusCheckerComponent,
    ) { }

    public getContainerStateResolver(containerNamePrefixExtractor?: (object: any) => string): (object: any) => Promise<string> {
        return async (object: any): Promise<string> => {
            return this.containerStatusChecker.check(containerNamePrefixExtractor(object));
        };
    }
}
