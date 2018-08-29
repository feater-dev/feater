import {Component} from '@nestjs/common';
import * as got from 'got';
import * as querystring  from 'querystring';
import {CachedContainerInfo, ContainerDetailsWorker} from './container-details-worker.component';
import {Config} from '../config/config.component';
import * as redis from 'redis';
import * as _ from 'lodash';

@Component()
export class ContainerStatusChecker {

    private redisClient;

    constructor(
        private readonly config: Config,
        private readonly containerDetailsWorker: ContainerDetailsWorker,
    ) {
        this.redisClient = redis.createClient({url: this.config.redis.url});
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
