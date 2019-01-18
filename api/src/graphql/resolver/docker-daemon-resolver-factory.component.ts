import {Injectable} from '@nestjs/common';
import {ContainerStateCheckerComponent} from '../../instantiation/container-state-checker-component.service';
import {IpAddressCheckerComponent} from '../../instantiation/ip-address-checker.component';

@Injectable()
export class DockerDaemonResolverFactory {
    constructor(
        private readonly containerStatusChecker: ContainerStateCheckerComponent,
        private readonly ipAddressChecker: IpAddressCheckerComponent,
    ) { }

    public getContainerStateResolver(containerNamePrefixExtractor?: (object: any) => string): (object: any) => Promise<string|null> {
        return async (object: any): Promise<string|null> => {
            return this.containerStatusChecker.check(containerNamePrefixExtractor(object));
        };
    }

    public getIpAddressResolver(containerNamePrefixExtractor?: (object: any) => string): (object: any) => Promise<string|null> {
        return async (object: any): Promise<string|null> => {
            return this.ipAddressChecker.check(containerNamePrefixExtractor(object));
        };
    }
}
