import {Component} from '@nestjs/common';
import {CachedContainerInfo, ContainerDetailsWorker} from './container-details-worker.component';
import * as redis from 'redis';
import * as _ from 'lodash';
import {environment} from '../environment/environment';

@Component()
export class ContainerStatusChecker {

    private redisClient;

    constructor(
        private readonly containerDetailsWorker: ContainerDetailsWorker,
    ) {
        this.redisClient = redis.createClient({url: environment.redis.url});
    }

    check(containerNamePrefix: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.containerDetailsWorker
                .updateCache()
                .then(() => {
                    this.redisClient.get(
                        'containerInfos',
                        (err, reply) => {
                            const containerInfos: [CachedContainerInfo] = JSON.parse(reply);
                            if (err) {
                                reject(err);
                            }
                            const containerInfo = _.find(containerInfos, {namePrefix: containerNamePrefix});
                            if (undefined === containerInfo) {
                                resolve(null);

                                return;
                            }

                            resolve((containerInfo as CachedContainerInfo).state);
                        },
                    );
                });

        });
    }
}
