var path = require('path');
var fs = require('fs-extra');

module.exports = function (config, jobClasses) {

    let { BuildJob, JobExecutor } = jobClasses;

    class CreateDirectoryJob extends BuildJob {
    }

    class CreateDirectoryJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof CreateDirectoryJob);
        }

        execute(job) {
            return new Promise(resolve => {
                let { build } = job;

                build.log('Creating build directory.');

                build.fullBuildPath = path.join(config.paths.build, build.shortid);
                build.fullBuildHostPath = path.join(config.hostPaths.build, build.shortid);

                fs.mkdirSync(build.fullBuildPath);

                job.setResult({ fullBuildPath: build.fullBuildPath });

                resolve();

            });
        }
    }

    return {
        CreateDirectoryJob,
        CreateDirectoryJobExecutor
    };

};
