import { Injectable } from '@nestjs/common';
import { ContainerInfoChecker } from './container-info-checker-component.service';

@Injectable()
export class ContainerStateCheckerComponent {
    constructor(private readonly containerInfoChecker: ContainerInfoChecker) {}

    async check(containerNamePrefix: string): Promise<string | null> {
        const containerInfo = this.containerInfoChecker.getContainerInfo(
            containerNamePrefix,
        );

        return containerInfo ? containerInfo.state : null;
    }
}
