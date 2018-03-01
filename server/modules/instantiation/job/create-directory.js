var path = require('path');
var fs = require('fs-extra');

module.exports = function (config, baseClasses) {

    let { BuildInstanceJob, JobExecutor } = baseClasses;

    class CreateDirectoryJob extends BuildInstanceJob {
    }

    class CreateDirectoryJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof CreateDirectoryJob);
        }

        execute(job) {
            return new Promise(resolve => {
                let { buildInstance } = job;

                buildInstance.log('Creating build directory.');

                buildInstance.fullBuildPath = path.join(config.paths.build, buildInstance.shortid);
                buildInstance.fullBuildHostPath = path.join(config.hostPaths.build, buildInstance.shortid);

                fs.mkdirSync(buildInstance.fullBuildPath);

                job.setResult({ fullBuildPath: buildInstance.fullBuildPath });

                resolve();

            });
        }
    }

    return {
        CreateDirectoryJob,
        CreateDirectoryJobExecutor
    };

};
