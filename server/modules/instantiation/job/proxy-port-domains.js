let path = require('path');
let fs = require('fs');
let { execSync } = require('child_process');

const BUFFER_SIZE = 1048576; // 1M

module.exports = function (config, jobClasses, buildRepository) {

    let { BuildJob, JobExecutor } = jobClasses;

    class ProxyPortDomainsJob extends BuildJob {}

    class ProxyPortDomainsJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ProxyPortDomainsJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { build } = job;

                console.log('Proxying port domains.');

                let nginxConfs = [];

                for (let serviceId in build.services) {
                    let service = build.services[serviceId];

                    for (let exposedPort of service.exposedPorts) {
                        for (let domainType in exposedPort.proxyDomains) {

                            nginxConfs.push(
                                `
# Proxy domain for port ${exposedPort.port} of ${serviceId} running at ${service.ipAddress}
server {
    listen 80;
    server_name ${exposedPort.proxyDomains[domainType]};

    location / {
        proxy_pass http://${service.ipAddress}:${exposedPort.port};
        proxy_set_header Host $host:${config.app.port};
    }
}
`
                            );

                        }
                    }
                }

                fs.writeFileSync(
                    path.join(config.guestPaths.proxyDomain, `build-${build.hash}.conf`),
                    nginxConfs.join('\n\n')
                );

                execSync(
                    `docker exec -t feat_nginx /etc/init.d/nginx restart`,
                    {maxBuffer: BUFFER_SIZE}
                );

                buildRepository.updateServices(build);

                resolve();
            });
        }
    }

    return {
        ProxyPortDomainsJob,
        ProxyPortDomainsJobExecutor
    };

};
