import {Component} from '@nestjs/common';
import {Config} from '../../config/config.component';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {InstanceRepository} from '../../persistence/repository/instance.repository';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';

export class PreparePortDomainsJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class PreparePortDomainsJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly config: Config,
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly instanceRepository: InstanceRepository,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof PreparePortDomainsJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as PreparePortDomainsJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);
        const { build } = buildJob;

        return new Promise((resolve, reject) => {
            logger.info('Preparing port domains.');

            for (const proxiedPort of build.config.proxiedPorts) {

                const service = build.services[proxiedPort.serviceId];

                if (!service) {
                    logger.error(`Unknown service ${proxiedPort.serviceId}.`);
                    reject();

                    return;
                }

                const proxyDomain = `build-${build.hash}-${proxiedPort.id}.${this.config.app.host}`;

                build.envVariables.add(`FEAT__PROXY_DOMAIN__${proxiedPort.id.toUpperCase()}`, proxyDomain);
                build.addFeatVariable(`proxy_domain__${proxiedPort.id}`, proxyDomain);

                service.proxiedPorts.push({
                    serviceId: proxiedPort.serviceId,
                    id: proxiedPort.id,
                    name: proxiedPort.name,
                    port: proxiedPort.port,
                    proxyDomain: proxyDomain,
                });
            }

            this.instanceRepository.updateServices(build);

            resolve();
        });
    }
}
