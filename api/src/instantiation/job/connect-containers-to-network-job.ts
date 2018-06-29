import {execSync} from 'child_process';
import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {InstanceRepository} from '../../persistence/repository/instance.repository';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {Config} from '../../config/config.component';

const BUFFER_SIZE = 1048576; // 1M

export class ConnectContainersToNetworkJob implements BuildJobInterface {

    constructor(readonly build: any) {}

}

@Component()
export class ConnectContainersToNetworkJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly config: Config,
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly instanceRepository: InstanceRepository,
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
                    `docker network connect ${this.config.instantiation.proxyDomainsNetworkName} ${service.containerId}`,
                    { maxBuffer: BUFFER_SIZE },
                );

                const dockerInspectStdout = execSync(
                    `docker inspect ${service.containerId}`,
                    { maxBuffer: BUFFER_SIZE },
                ).toString();

                service.ipAddress = JSON.parse(dockerInspectStdout)[0].NetworkSettings.Networks[this.config.instantiation.proxyDomainsNetworkName].IPAddress;
            }

            this.instanceRepository
                .updateServices(build)
                .then(resolve);
        });
    }

}
