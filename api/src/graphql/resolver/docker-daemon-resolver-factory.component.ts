import {Injectable} from '@nestjs/common';
import {ContainerStatusCheckerComponent} from '../../instantiation/container-status-checker.component';
import {IpAddressCheckerComponent} from '../../instantiation/ip-address-checker.component';

@Injectable()
export class DockerDaemonResolverFactory {
    constructor(
        private readonly containerStatusChecker: ContainerStatusCheckerComponent,
        private readonly ipAddressChecker: IpAddressCheckerComponent,
    ) { }

    public getContainerStateResolver(containerNamePrefixExtractor?: (object: any) => string): (object: any) => Promise<string> {
        return async (object: any): Promise<string> => {
            return this.containerStatusChecker.check(containerNamePrefixExtractor(object));
        };
    }

    public getIpAddressResolver(containerNamePrefixExtractor?: (object: any) => string): (object: any) => Promise<string> {
        return async (object: any): Promise<string> => {
            return this.ipAddressChecker.check(containerNamePrefixExtractor(object));
        };
    }
}
