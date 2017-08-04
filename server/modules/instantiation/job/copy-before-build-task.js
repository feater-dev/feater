var path = require('path');
var fs = require('fs-extra');
var Promise = require('bluebird');

module.exports = function (
    baseClasses
) {

    var {ComponentInstanceJob, JobExecutor} = baseClasses;

    class CopyBeforeBuildTaskJob extends ComponentInstanceJob {
        constructor(componentInstance, sourceRelativePath, destinationRelativePath) {
            super(componentInstance);
            this.sourceRelativePath = sourceRelativePath;
            this.destinationRelativePath = destinationRelativePath;
        }
    }

    class CopyBeforeBuildTaskJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof CopyBeforeBuildTaskJob);
        }

        execute(job) {
            var { componentInstance, sourceRelativePath, destinationRelativePath } = job;

            return new Promise((resolve) => {
                componentInstance.log(`Copying ${sourceRelativePath} to ${destinationRelativePath}.`);
                fs.copySync(
                    path.join(componentInstance.fullPath, sourceRelativePath),
                    path.join(componentInstance.fullPath, destinationRelativePath)
                );

                resolve();
            });
        }
    }

    return {
        CopyBeforeBuildTaskJob,
        CopyBeforeBuildTaskJobExecutor
    };

};
