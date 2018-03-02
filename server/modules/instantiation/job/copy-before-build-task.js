let path = require('path');
let fs = require('fs-extra');

module.exports = function (jobClasses) {

    let { SourceJob, JobExecutor } = jobClasses;

    class CopyBeforeBuildTaskJob extends SourceJob {
        constructor(source, sourceRelativePath, destinationRelativePath) {
            super(source);
            this.sourceRelativePath = sourceRelativePath;
            this.destinationRelativePath = destinationRelativePath;
        }
    }

    class CopyBeforeBuildTaskJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof CopyBeforeBuildTaskJob);
        }

        execute(job) {
            let { source, sourceRelativePath, destinationRelativePath } = job;

            return new Promise(resolve => {
                source.log(`Copying ${sourceRelativePath} to ${destinationRelativePath}.`);
                fs.copySync(
                    path.join(source.fullBuildPath, sourceRelativePath),
                    path.join(source.fullBuildPath, destinationRelativePath)
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
