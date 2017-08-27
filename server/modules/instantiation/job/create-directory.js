var path = require('path');
var fs = require('fs-extra');
var Promise = require('bluebird');


module.exports = function (
    config,
    baseClasses
) {

    var { BuildInstanceJob, JobExecutor } = baseClasses;

    class CreateDirectoryJob extends BuildInstanceJob {
    }

    class CreateDirectoryJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof CreateDirectoryJob);
        }

        execute(job) {
            return new Promise((resolve) => {
                var { buildInstance } = job;
                var fullBuildPath = path.join(config.paths.buildInstanceBuild, buildInstance.id);

                buildInstance.log(`Creating build instance directory at ${fullBuildPath}.`);

                fs.mkdirSync(fullBuildPath);
                buildInstance.fullBuildPath = fullBuildPath;

                buildInstance.fullVolumePath = path.join(config.paths.buildInstanceVolume, buildInstance.id);

                job.setResult({ fullBuildPath });

                resolve();

            });
        }
    }

    return {
        CreateDirectoryJob,
        CreateDirectoryJobExecutor
    };

};
