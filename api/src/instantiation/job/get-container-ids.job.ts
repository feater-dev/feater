import * as _ from 'lodash';
import { execSync } from 'child_process';
import { Component } from '@nestjs/common';
import { JobLoggerFactory } from '../../logger/job-logger-factory';
import { BuildInstanceRepository } from '../../persistence/build-instance.repository';
import { BuildJobInterface, JobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

const BUFFER_SIZE = 1048576; // 1M

export class GetContainerIdsJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class GetContainerIdsJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly buildInstanceRepository: BuildInstanceRepository,
    ) {}

    supports(job: JobInterface) {
        return (job instanceof GetContainerIdsJob);
    }

    execute(job: JobInterface, data: any) {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as BuildJobInterface;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);
        const {build} = buildJob;

        return new Promise((resolve, reject) => {
            logger.info('Determining container ids.');

            const serviceIds = Object.keys(build.services)
                .sort((serviceId1, serviceId2) => {
                    return serviceId2.length - serviceId1.length;
                });

            const matchedContainerIds = [];

            for (const serviceId of serviceIds) {
                const stdout = execSync(
                    `docker ps -q --no-trunc --filter name=${build.services[serviceId].containerNamePrefix}`,
                    {maxBuffer: BUFFER_SIZE},
                ).toString();

                const containerIds = _.difference(
                    stdout.replace(/\n$/g, '').split('\n'),
                    matchedContainerIds,
                );

                if (containerIds.length < 1) {
                    logger.error(`No running container for service ${serviceId}.`);
                    reject();

                    return;
                }

                if (containerIds.length > 1) {
                    logger.error(`Too many running containers for service ${serviceId}.`);
                    reject();

                    return;
                }

                const containerId = containerIds[0];

                if (!/^[a-f\d]+$/.test(containerId)) {
                    logger.error(`Invalid container id for service ${serviceId}.`);
                    reject();

                    return;
                }

                matchedContainerIds.push(containerId);
                build.services[serviceId].containerId = containerId;
            }

            this.buildInstanceRepository
                .updateServices(build)
                .then(resolve);
        });
    }

}
