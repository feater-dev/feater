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

                console.log('Preparing port domains.');

                for (let serviceId in build.config.exposedPorts) {
                    let service = build.services[serviceId];

                    if (!service) {
                        console.log(`Unknown service ${serviceId}.`);
                        reject();

                        return;
                    }

                    for (let exposedPort of build.config.exposedPorts[serviceId]) {
                        let shortProxyDomain = `build-${build.hash}-${exposedPort.id}.${config.app.host}`;
                        let longProxyDomain = `build-${build.hash}-${service.cleanId}-${exposedPort.port}.${config.app.host}`;

                        build.addFeatVariable(`proxy_domain__${exposedPort.id}`, shortProxyDomain);
                        build.addFeatVariable(`proxy_domain_long__${exposedPort.id}`, longProxyDomain);

                        service.exposedPorts.push({
                            serviceId,
                            id: exposedPort.id,
                            name: exposedPort.name,
                            port: exposedPort.port,
                            proxyDomains: {
                                short: shortProxyDomain,
                                long: longProxyDomain
                            }
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
