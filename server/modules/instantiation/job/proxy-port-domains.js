let path = require('path');
let fs = require('fs');
let { execSync } = require('child_process');

const BUFFER_SIZE = 1048576; // 1M

module.exports = function (config, baseClasses, buildInstanceRepository) {

    let { BuildInstanceJob, JobExecutor } = baseClasses;

    class ProxyPortDomainsJob extends BuildInstanceJob {}

    class ProxyPortDomainsJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ProxyPortDomainsJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { buildInstance } = job;

                buildInstance.log('Proxying port domains.');

                let nginxConfs = [];

                for (let serviceId in buildInstance.services) {
                    let service = buildInstance.services[serviceId];

                    for (let exposedPort of service.exposedPorts) {
                        nginxConfs.push(
`
# Proxy domain for port ${exposedPort.port} of ${serviceId} running at ${service.ipAddress}
server {
    listen 80;
    server_name ${exposedPort.domain};

    location / {
        proxy_pass http://${service.ipAddress}:${exposedPort.port};
        proxy_set_header Host $host:${config.web.port};
    }
}
`
                        );
                    }
                }

                fs.writeFileSync(
                    path.join(config.paths.domain, `build-${buildInstance.shortid}.conf`),
                    nginxConfs.join('\n\n')
                );

                execSync(
                    `docker exec -t feat_nginx /etc/init.d/nginx restart`,
                    {maxBuffer: BUFFER_SIZE}
                );

                buildInstanceRepository.updateServices(buildInstance);

                resolve();
            });
        }
    }

    return {
        ProxyPortDomainsJob,
        ProxyPortDomainsJobExecutor
    };

};
