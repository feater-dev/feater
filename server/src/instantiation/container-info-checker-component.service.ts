import {Injectable} from '@nestjs/common';
import * as got from 'got';
import * as querystring from 'querystring';
import {config} from '../config/config';
import * as _ from 'lodash';
import {setInterval} from 'timers';

export interface CachedContainerInfo {
    readonly namePrefix: string;
    readonly id: string;
    readonly state: string;
    readonly status: string;
    readonly ipAddress: string;
}

@Injectable()
export class ContainerInfoCheckerComponent {

    private containerNameRegExp = new RegExp(
        `^/${config.instantiation.containerNamePrefix}([a-z0-9]{8})_(.+?)_\\d+\$`,
    );

    private containerInfos: CachedContainerInfo[] = [];

    constructor() {
        setInterval(() => { this.updateCache(); }, 2000);
    }

    updateCache(): void {
        got(
            'unix:/var/run/docker.sock:/containers/json',
            {
                json: true,
                query: this.prepareQueryString(),
            },
        ).then(response => {
            const parsedContainerInfos = [];
            this.containerInfos.splice(0);
            for (const containerInfo of response.body) {
                this.containerInfos.push(this.parseContainerInfo(containerInfo));
            }
        });
    }

    getContainerInfo(containerNamePrefix: string): CachedContainerInfo|null {
        return _.find(this.containerInfos, {namePrefix: containerNamePrefix});
    }

    protected prepareQueryString(): string {
        return querystring.stringify({
            all: true,
            filters: JSON.stringify({
                name: [config.instantiation.containerNamePrefix],
            }),
        });
    }

    protected parseContainerInfo(containerInfo: any): CachedContainerInfo|null {
        const matches = containerInfo.Names[0].match(this.containerNameRegExp);
        if (null === matches) {
            return null;
        }

        const instanceHash = matches[1];
        const serviceName = matches[2];
        const networkName = `${config.instantiation.containerNamePrefix}${instanceHash}_default`;

        return {
            namePrefix: `${config.instantiation.containerNamePrefix}${instanceHash}_${serviceName}`,
            id: containerInfo.Id,
            state: containerInfo.State,
            status: containerInfo.Status,
            ipAddress: containerInfo.NetworkSettings.Networks[networkName].IPAddress,
        };
    }
}
