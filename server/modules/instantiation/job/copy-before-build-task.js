let path = require('path');
let fs = require('fs-extra');

module.exports = function (baseClasses) {

    let { ComponentInstanceJob, JobExecutor } = baseClasses;

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
            let { componentInstance, sourceRelativePath, destinationRelativePath } = job;

            return new Promise(resolve => {
                componentInstance.log(`Copying ${sourceRelativePath} to ${destinationRelativePath}.`);
                fs.copySync(
                    path.join(componentInstance.fullBuildPath, sourceRelativePath),
                    path.join(componentInstance.fullBuildPath, destinationRelativePath)
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
