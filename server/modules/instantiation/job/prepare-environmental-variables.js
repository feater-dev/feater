var _ = require('underscore');

module.exports = function (baseClasses, interpolationHelper, buildInstanceRepository) {

    var { BuildInstanceJob, JobExecutor } = baseClasses;

    class PrepareEnvironmentalVariablesJob extends BuildInstanceJob {}

    class PrepareEnvironmentalVariablesJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof PrepareEnvironmentalVariablesJob);
        }

        execute(job) {
            var { buildInstance } = job;

            return new Promise(resolve => {
                _.each(
                    buildInstance.componentInstances,
                    (componentInstance, componentId) => {
                        buildInstance.addEnvironmentalVariable(`FEAT__BUILD_PATH__${componentId.toUpperCase()}`, componentInstance.fullBuildPath);
                        buildInstance.addEnvironmentalVariable(`FEAT__VOLUME_PATH__${componentId.toUpperCase()}`, componentInstance.fullBuildHostPath);
                    }
                );

                _.each(
                    buildInstance.featVariables,
                    (value, name) => {
                        buildInstance.addEnvironmentalVariable(`FEAT__${name.replace(/\./g, '__').toUpperCase()}`, value)
                    }
                );

                _.each(
                    buildInstance.config.environmentalVariables,
                    (value, name) => {
                        buildInstance.addEnvironmentalVariable(
                            name,
                            interpolationHelper.interpolateText(value, buildInstance.featVariables, buildInstance.exposedPorts)
                        )
                    }
                );

                buildInstance.log(`Environmental variables set to ${buildInstance.getEnvironmentalVariablesString()}`);

                buildInstanceRepository
                    .updateEnvironmentalVariables(buildInstance)
                    .then(resolve());
            });
        }
    }

    return {
        PrepareEnvironmentalVariablesJob,
        PrepareEnvironmentalVariablesJobExecutor
    };

};
