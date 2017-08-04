var path = require('path');
var fs = require('fs-extra');
var Promise = require('bluebird');


module.exports = function (baseClasses) {

    var {BuildInstanceJob, JobExecutor} = baseClasses;

    class CreateDirectoryJob extends BuildInstanceJob {
    }

    class CreateDirectoryJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof CreateDirectoryJob);
        }

        execute(job) {
            return new Promise((resolve) => {
                var {buildInstance} = job;
                var fullPath = path.join(__dirname, '../../../../buildInstances', buildInstance.id); // TODO Base directory should be given from outside.
                fs.mkdirSync(fullPath);  // TODO Check if this directory doesn't already exist.
                buildInstance.fullPath = fullPath;
                job.setResult({fullPath});

                resolve();

            });
        }
    }

    return {
        CreateDirectoryJob,
        CreateDirectoryJobExecutor
    };

};
