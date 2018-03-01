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

                    for (let port of buildInstance.config.exposedPorts[serviceId]) {
                        let exposedPort = {
                            serviceId,
                            port,
                            name: 'dummy', // TODO
                            domain: `build-${buildInstance.shortid}-${service.cleanId}-${port}.${config.web.host}`
                        };

                        buildInstance.addFeatVariable(`exposed_port_domain.${serviceId}.${port}`, exposedPort.domain);

                        service.exposedPorts.push(exposedPort);
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
