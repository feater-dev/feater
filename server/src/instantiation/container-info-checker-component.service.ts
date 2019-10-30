import { Injectable } from '@nestjs/common';
import { from, interval } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { config } from '../config/config';
import * as got from 'got';
import * as querystring from 'querystring';
import * as _ from 'lodash';

export interface CachedContainerInfo {
    readonly namePrefix: string;
    readonly id: string;
    readonly state: string;
    readonly status: string;
    readonly ipAddress?: string;
}

@Injectable()
export class ContainerInfoChecker {
    private POLLING_INTERVAL = 10000; // in milliseconds, equals to 10 seconds.

    private containerNameRegExp = new RegExp(
        `^/${config.instantiation.containerNamePrefix}([a-z0-9]{8})_(.+?)_\\d+\$`,
    );

    private containerInfos: CachedContainerInfo[] = [];

    constructor() {
        interval(this.POLLING_INTERVAL)
            .pipe(exhaustMap(() => from(this.fetchContainersInfo())))
            .subscribe(response => {
                this.updateContainersInfo(response);
            });
    }

    getContainerInfo(containerNamePrefix: string): CachedContainerInfo | null {
        return _.find(this.containerInfos, { namePrefix: containerNamePrefix });
    }

    private fetchContainersInfo(): Promise<void> {
        return got('unix:/var/run/docker.sock:/containers/json', {
            json: true,
            query: this.prepareQueryString(),
        });
    }

    private prepareQueryString(): string {
        return querystring.stringify({
            all: true,
            filters: JSON.stringify({
                name: [config.instantiation.containerNamePrefix],
            }),
        });
    }

    // TODO Replace `any` with more specific type.
    private parseContainerInfo(containerInfo: any): CachedContainerInfo | null {
        const matches = containerInfo.Names[0].match(this.containerNameRegExp);
        if (null === matches) {
            return null;
        }

        const instanceHash = matches[1];
        const serviceName = matches[2];
        const networkName = `${config.instantiation.containerNamePrefix}${instanceHash}_default`;
        const network = containerInfo.NetworkSettings.Networks[networkName];

        return {
            namePrefix: `${config.instantiation.containerNamePrefix}${instanceHash}_${serviceName}`,
            id: containerInfo.Id,
            state: containerInfo.State,
            status: containerInfo.Status,
            ipAddress: network ? network.IPAddress : null,
        };
    }

    // TODO Replace `any` with more specific type.
    private updateContainersInfo(response: any): void {
        this.containerInfos.splice(0);
        for (const containerInfo of response.body) {
            this.containerInfos.push(this.parseContainerInfo(containerInfo));
        }
    }
}
