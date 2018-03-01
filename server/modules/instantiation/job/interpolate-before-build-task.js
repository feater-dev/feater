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
            let { componentInstance } = job;

            return new Promise(resolve => {
                let fullPath = path.join(componentInstance.fullBuildPath, job.relativePath);
                let { featVariables, exposedPorts } = componentInstance.buildInstance;

                componentInstance.log(`Interpolating Feat variables in ${job.relativePath}.`);
                interpolationHelper.interpolateFile(fullPath, featVariables, exposedPorts);

                resolve();
            });
        }
    }

    return {
        InterpolateBeforeBuildTaskJob,
        InterpolateBeforeBuildTaskJobExecutor
    };

};
