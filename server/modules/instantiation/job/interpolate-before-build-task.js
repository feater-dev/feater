var path = require('path');

module.exports = function (baseClasses, interpolationHelper) {

    var { ComponentInstanceJob, JobExecutor } = baseClasses;

    class InterpolateBeforeBuildTaskJob extends ComponentInstanceJob {
        constructor(componentInstance, relativePath) {
            super(componentInstance);
            this.relativePath = relativePath;
        }
    }

    class InterpolateBeforeBuildTaskJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof InterpolateBeforeBuildTaskJob);
        }

        execute(job) {
            var { componentInstance } = job;

            return new Promise((resolve) => {
                var fullPath = path.join(componentInstance.fullBuildPath, job.relativePath);
                var { featVariables, externalPorts } = componentInstance.buildInstance;

                componentInstance.log(`Interpolating Feat variables in ${job.relativePath}.`);
                interpolationHelper.interpolateFile(fullPath, featVariables, externalPorts);

                resolve();
            });
        }
    }

    return {
        InterpolateBeforeBuildTaskJob,
        InterpolateBeforeBuildTaskJobExecutor
    };

};
