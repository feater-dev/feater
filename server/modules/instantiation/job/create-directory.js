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

                console.log('Creating build directory.');

                build.fullBuildPath = path.join(config.guestPaths.build, build.hash);
                build.fullBuildHostPath = path.join(config.hostPaths.build, build.hash);

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
