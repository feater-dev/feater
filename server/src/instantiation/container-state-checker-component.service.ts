import { Injectable } from '@nestjs/common';
import { ContainerInfoCheckerComponent } from './container-info-checker-component.service';

@Injectable()
export class ContainerStateCheckerComponent {
    constructor(
        private readonly containerInfoChecker: ContainerInfoCheckerComponent,
    ) {}

    async check(containerNamePrefix: string): Promise<string | null> {
        const containerInfo = this.containerInfoChecker.getContainerInfo(
            containerNamePrefix,
        );

        return containerInfo ? containerInfo.state : null;
    }
}
