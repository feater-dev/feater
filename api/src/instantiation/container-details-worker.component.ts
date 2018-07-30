import {Component} from '@nestjs/common';
import * as got from 'got';
import {Config} from '../config/config.component';
import * as querystring from 'querystring';
import * as redis from 'redis';

export interface CachedContainerInfo {
    readonly namePrefix: string;
    readonly id: string;
    readonly state: string;
    readonly status: string;
}

@Component()
export class ContainerDetailsWorker {

    private containerNameRegExp;

    private redisClient;

    constructor(
        private readonly config: Config,
    ) {
        this.containerNameRegExp = new RegExp(`^/${this.config.instantiation.containerNamePrefix}([a-z0-9]{8})_(.+?)_\\d+\$`);
        this.redisClient = redis.createClient({url: this.config.redis.url});
    }

    updateCache(): Promise<any> {
        return got(
            'unix:/var/run/docker.sock:/containers/json',
            {
                json: true,
                query: this.prepareQueryString(),
            },
        ).then(response => {
            const parsedContainerInfos = [];
            for (const containerInfo of response.body) {
                parsedContainerInfos.push(this.parseContainerInfo(containerInfo));
            }

            return new Promise((resolve, reject) => {
                this.redisClient.set(
                    'containerInfos',
                    JSON.stringify(parsedContainerInfos),
                    (err) => {
                        if (err) {
                            reject(err);
                        }

                        resolve();
                    },
                );
            });
        });
    }

    protected prepareQueryString(): string {
        return querystring.stringify({
            all: true,
            filters: JSON.stringify({
                name: [this.config.instantiation.containerNamePrefix],
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

        return {
            namePrefix: `${this.config.instantiation.containerNamePrefix}${instanceHash}_${serviceName}`,
            id: containerInfo.Id,
            state: containerInfo.State,
            status: containerInfo.Status,
        };
    }
}
