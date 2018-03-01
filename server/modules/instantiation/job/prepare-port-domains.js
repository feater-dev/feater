module.exports = function (config, baseClasses, buildInstanceRepository) {

    let { BuildInstanceJob, JobExecutor } = baseClasses;

    class PreparePortDomainsJob extends BuildInstanceJob {}

    class PreparePortDomainsJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof PreparePortDomainsJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { buildInstance } = job;

                buildInstance.log('Preparing port domains.');

                for (let serviceId in buildInstance.config.exposedPorts) {
                    let service = buildInstance.services[serviceId];

                    if (!service) {
                        buildInstance.log(`Unknown service ${serviceId}.`);
                        reject();

                        return;
                    }

                    for (let exposedPort of buildInstance.config.exposedPorts[serviceId]) {
                        let longDomain = `build-${buildInstance.shortid}-${service.cleanId}-${exposedPort.port}.${config.web.host}`;
                        let shortDomain = `build-${buildInstance.shortid}-${exposedPort.id}.${config.web.host}`;

                        buildInstance.addFeatVariable(`exposed_port_domain_long__${exposedPort.id}`, longDomain);
                        buildInstance.addFeatVariable(`exposed_port_domain__${exposedPort.id}`, shortDomain);

                        service.exposedPorts.push({
                            serviceId,
                            id: exposedPort.id,
                            name: exposedPort.name,
                            port: exposedPort.port,
                            domains: [longDomain, shortDomain]
                        });
                    }
                }

                buildInstanceRepository.updateServices(buildInstance);

                resolve();
            });
        }
    }

    return {
        PreparePortDomainsJob,
        PreparePortDomainsJobExecutor
    };

};
