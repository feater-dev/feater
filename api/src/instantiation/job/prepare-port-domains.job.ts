import { Component } from '@nestjs/common';
import { Config } from '../../config/config.component';
import { BuildInstanceRepository } from '../../persistence/build-instance.repository';
import { BuildJobInterface, JobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

export class PreparePortDomainsJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class PreparePortDomainsJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly config: Config,
        private readonly buildInstanceRepository: BuildInstanceRepository,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof PreparePortDomainsJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as PreparePortDomainsJob;
        const { build } = buildJob;

        return new Promise((resolve, reject) => {
            console.log('Preparing port domains.');

            for (const serviceId of Object.keys(build.config.exposedPorts)) {
                const service = build.services[serviceId];

                if (!service) {
                    console.log(`Unknown service ${serviceId}.`);
                    reject();

                    return;
                }

                for (const exposedPort of build.config.exposedPorts[serviceId]) {
                    const shortProxyDomain = `build-${build.hash}-${exposedPort.id}.${this.config.app.host}`;
                    const longProxyDomain = `build-${build.hash}-${service.cleanId}-${exposedPort.port}.${this.config.app.host}`;

                    build.addFeatVariable(`proxy_domain__${exposedPort.id}`, shortProxyDomain);
                    build.addFeatVariable(`proxy_domain_long__${exposedPort.id}`, longProxyDomain);

                    service.exposedPorts.push({
                        serviceId,
                        id: exposedPort.id,
                        name: exposedPort.name,
                        port: exposedPort.port,
                        proxyDomains: {
                            short: shortProxyDomain,
                            long: longProxyDomain,
                        },
                    });
                }
            }

            this.buildInstanceRepository.updateServices(build);

            resolve();
        });
    }
}
