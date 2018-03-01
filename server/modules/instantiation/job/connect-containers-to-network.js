let _ = require('underscore');
let { execSync } = require('child_process');

const BUFFER_SIZE = 1048576; // 1M

const BUILD_NETWORK = 'feat_build';

module.exports = function (baseClasses, buildInstanceRepository) {

    let { BuildInstanceJob, JobExecutor } = baseClasses;

    class ConnectContainersToNetworkJob extends BuildInstanceJob {}

    class ConnectContainersToNetworkJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ConnectContainersToNetworkJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { buildInstance } = job;

                buildInstance.log('Connecting containers to build network.');

                for (let serviceId in buildInstance.services) {
                    let service = buildInstance.services[serviceId];

                    execSync(
                        `docker network connect ${BUILD_NETWORK} ${service.containerId}`,
                        {maxBuffer: BUFFER_SIZE}
                    );

                    let inspectStdout = execSync(
                        `docker inspect ${service.containerId}`,
                        {maxBuffer: BUFFER_SIZE}
                    ).toString();

                    service.ipAddress = JSON.parse(inspectStdout)[0].NetworkSettings.Networks[BUILD_NETWORK].IPAddress;
                }

                buildInstanceRepository.updateServices(buildInstance);

                resolve();
            });
        }
    }

    return {
        ConnectContainersToNetworkJob,
        ConnectContainersToNetworkJobExecutor
    };

};
