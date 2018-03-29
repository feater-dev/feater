import { execSync } from 'child_process';
import { Component } from '@nestjs/common';
import { JobLoggerFactory } from '../../logger/job-logger-factory';
import { BuildInstanceRepository } from '../../persistence/repository/build-instance.repository';
import { BuildJobInterface, JobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

const BUFFER_SIZE = 1048576; // 1M
// TODO Move to config
const BUILD_NETWORK = 'feat_build';

export class ConnectContainersToNetworkJob implements BuildJobInterface {

    constructor(readonly build: any) {}

}

@Component()
export class ConnectContainersToNetworkJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly buildInstanceRepository: BuildInstanceRepository,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof ConnectContainersToNetworkJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as ConnectContainersToNetworkJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);
        const build  = buildJob.build;

        return new Promise(resolve => {
            logger.info('Connecting containers to build network.');

            for (const serviceId of Object.keys(build.services)) {
                const service = build.services[serviceId];

                execSync(
                    `docker network connect ${BUILD_NETWORK} ${service.containerId}`,
                    { maxBuffer: BUFFER_SIZE },
                );

                const dockerInspectStdout = execSync(
                    `docker inspect ${service.containerId}`,
                    { maxBuffer: BUFFER_SIZE },
                ).toString();

                service.ipAddress = JSON.parse(dockerInspectStdout)[0].NetworkSettings.Networks[BUILD_NETWORK].IPAddress;
            }

            this.buildInstanceRepository
                .updateServices(build)
                .then(resolve);
        });
    }

}
