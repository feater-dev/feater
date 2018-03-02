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

            return new Promise(resolve => {
                let fullPath = path.join(source.fullBuildPath, job.relativePath);
                let { featVariables } = source.build;

                source.log(`Interpolating Feat variables in ${job.relativePath}.`);
                interpolationHelper.interpolateFile(fullPath, featVariables);

                resolve();
            });
        }
    }

    return {
        InterpolateBeforeBuildTaskJob,
        InterpolateBeforeBuildTaskJobExecutor
    };

};
