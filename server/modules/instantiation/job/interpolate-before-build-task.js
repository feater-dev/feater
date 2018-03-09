var path = require('path');

module.exports = function (jobClasses, interpolationHelper) {

    var { SourceJob, JobExecutor } = jobClasses;

    class InterpolateBeforeBuildTaskJob extends SourceJob {
        constructor(source, relativePath) {
            super(source);
            this.relativePath = relativePath;
        }
    }

    class InterpolateBeforeBuildTaskJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof InterpolateBeforeBuildTaskJob);
        }

        execute(job) {
            let { source } = job;

            let fullPath = path.join(source.fullBuildPath, job.relativePath);
            console.log(`Interpolating Feat variables in ${job.relativePath}.`);

            return new Promise(resolve => {

                interpolationHelper.interpolateFile(fullPath, source.build);

                resolve();
            });
        }
    }

    return {
        InterpolateBeforeBuildTaskJob,
        InterpolateBeforeBuildTaskJobExecutor
    };

};
