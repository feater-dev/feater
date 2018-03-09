let _ = require('lodash');
let { execSync } = require('child_process');

const BUFFER_SIZE = 1048576; // 1M

module.exports = function (jobClasses, buildRepository) {

    let { BuildJob, JobExecutor } = jobClasses;

    class GetContainerIdsJob extends BuildJob {}

    class GetContainerIdsJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof GetContainerIdsJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { build } = job;

                console.log('Determining container ids.');

                let serviceIds = _.keys(build.services)
                    .sort((serviceId1, serviceId2) => {
                        return serviceId2.length - serviceId1.length;
                    });

                let matchedContainerIds = [];

                for (let serviceId of serviceIds) {
                    let stdout = execSync(
                        `docker ps -q --no-trunc --filter name=${build.services[serviceId].containerNamePrefix}`,
                        { maxBuffer: BUFFER_SIZE }
                    ).toString();

                    let containerIds = _.difference(
                        stdout.replace(/\n$/g, '').split('\n'),
                        matchedContainerIds
                    );

                    if (containerIds.length < 1) {
                        console.log(`No running container for service ${serviceId}.`);
                        reject();

                        return;
                    }

                    if (containerIds.length > 1) {
                        console.log(`Too many running containers for service ${serviceId}.`);
                        reject();

                        return;
                    }

                    let containerId = containerIds[0];

                    if (!/^[a-f\d]+$/.test(containerId)) {
                        console.log(`Invalid container id for service ${serviceId}.`);
                        reject();

                        return;
                    }

                    matchedContainerIds.push(containerId);
                    build.services[serviceId].containerId = containerId;
                }

                buildRepository.updateServices(build);

                resolve();
            });
        }
    }

    return {
        GetContainerIdsJob,
        GetContainerIdsJobExecutor
    };

};
