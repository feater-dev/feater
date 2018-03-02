module.exports = function (config, jobClasses, buildRepository) {

    let { BuildJob, JobExecutor } = jobClasses;

    class PreparePortDomainsJob extends BuildJob {}

    class PreparePortDomainsJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof PreparePortDomainsJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { build } = job;

                build.log('Preparing port domains.');

                for (let serviceId in build.config.exposedPorts) {
                    let service = build.services[serviceId];

                    if (!service) {
                        build.log(`Unknown service ${serviceId}.`);
                        reject();

                        return;
                    }

                    for (let exposedPort of build.config.exposedPorts[serviceId]) {
                        let longDomain = `build-${build.shortid}-${service.cleanId}-${exposedPort.port}.${config.web.host}`;
                        let shortDomain = `build-${build.shortid}-${exposedPort.id}.${config.web.host}`;

                        build.addFeatVariable(`exposed_port_domain_long__${exposedPort.id}`, longDomain);
                        build.addFeatVariable(`exposed_port_domain__${exposedPort.id}`, shortDomain);

                        service.exposedPorts.push({
                            serviceId,
                            id: exposedPort.id,
                            name: exposedPort.name,
                            port: exposedPort.port,
                            domains: [longDomain, shortDomain]
                        });
                    }
                }

                buildRepository.updateServices(build);

                resolve();
            });
        }
    }

    return {
        PreparePortDomainsJob,
        PreparePortDomainsJobExecutor
    };

};
