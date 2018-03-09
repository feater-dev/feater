let { execSync } = require('child_process');

const BUFFER_SIZE = 1048576; // 1M

const BUILD_NETWORK = 'feat_build';

module.exports = function (jobClasses, buildRepository) {

    let { BuildJob, JobExecutor } = jobClasses;

    class ConnectContainersToNetworkJob extends BuildJob {}

    class ConnectContainersToNetworkJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ConnectContainersToNetworkJob);
        }

        execute(job) {
            return new Promise(resolve => {
                let { build } = job;

                console.log('Connecting containers to build network.');

                for (let serviceId in build.services) {
                    let service = build.services[serviceId];

                    execSync(
                        `docker network connect ${BUILD_NETWORK} ${service.containerId}`,
                        { maxBuffer: BUFFER_SIZE }
                    );

                    let dockerInspectStdout = execSync(
                        `docker inspect ${service.containerId}`,
                        { maxBuffer: BUFFER_SIZE }
                    ).toString();

                    service.ipAddress = JSON.parse(dockerInspectStdout)[0].NetworkSettings.Networks[BUILD_NETWORK].IPAddress;
                }

                buildRepository.updateServices(build);

                resolve();
            });
        }
    }

    return {
        ConnectContainersToNetworkJob,
        ConnectContainersToNetworkJobExecutor
    };

};
