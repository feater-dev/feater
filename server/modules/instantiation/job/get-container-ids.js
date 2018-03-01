let _ = require('underscore');
let { execSync } = require('child_process');

const BUFFER_SIZE = 1048576; // 1M

module.exports = function (baseClasses, buildInstanceRepository) {

    let { BuildInstanceJob, JobExecutor } = baseClasses;

    class GetContainerIdsJob extends BuildInstanceJob {}

    class GetContainerIdsJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof GetContainerIdsJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { buildInstance } = job;

                buildInstance.log('Determining container ids.');

                let serviceIds = _.keys(buildInstance.services)
                    .sort((serviceId1, serviceId2) => {
                        return serviceId2.length - serviceId1.length;
                    });

                let matchedContainerIds = [];

                for (let serviceId of serviceIds) {
                    let stdout = execSync(
                        `docker ps -q --no-trunc --filter name=${buildInstance.services[serviceId].containerNamePrefix}`,
                        {maxBuffer: BUFFER_SIZE}
                    ).toString();

                    let containerIds = _.difference(
                        stdout.replace(/\n$/g, '').split('\n'),
                        matchedContainerIds
                    );

                    if (containerIds.length < 1) {
                        buildInstance.log(`No running container for service ${serviceId}.`);
                        reject();

                        return;
                    }

                    if (containerIds.length > 1) {
                        buildInstance.log(`Too many running containers for service ${serviceId}.`);
                        reject();

                        return;
                    }

                    let containerId = containerIds[0];

                    if (!/^[a-f\d]+$/.test(containerId)) {
                        buildInstance.log(`Invalid container id for service ${serviceId}.`);
                        reject();

                        return;
                    }

                    matchedContainerIds.push(containerId);
                    buildInstance.services[serviceId].containerId = containerId;
                }

                buildInstanceRepository.updateServices(buildInstance);

                resolve();
            });
        }
    }

    return {
        GetContainerIdsJob,
        GetContainerIdsJobExecutor
    };

};
