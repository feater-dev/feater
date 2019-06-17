import {ContainerStateCheckerComponent} from '../../instantiation/container-state-checker-component.service';
import {IpAddressCheckerComponent} from '../../instantiation/ip-address-checker.component';
import {Parent, ResolveProperty, Resolver} from '@nestjs/graphql';
import {InstanceServiceTypeInterface} from '../type/instance-service-type.interface';

@Resolver('InstanceService')
export class InstanceServiceResolver {
    constructor(
        private readonly containerStatusChecker: ContainerStateCheckerComponent,
        private readonly ipAddressChecker: IpAddressCheckerComponent,
    ) { }

    @ResolveProperty('containerState')
    async getState(
        @Parent() instanceService: InstanceServiceTypeInterface,
    ): Promise<string|null> {
        return this.containerStatusChecker.check(instanceService.containerNamePrefix);
    }

    @ResolveProperty('ipAddress')
    async getIpAddress(
        @Parent() instanceService: InstanceServiceTypeInterface,
    ): Promise<string|null> {
        return this.ipAddressChecker.check(instanceService.containerNamePrefix);
    }
}
