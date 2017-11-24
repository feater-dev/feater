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
                        buildInstance.addEnvironmentalVariable(`FEAT__VOLUME_PATH__${componentId.toUpperCase()}`, componentInstance.fullVolumePath);
                    }
                );
                _.each(
                    buildInstance.externalPorts,
                    (port, portId) => {
                        buildInstance.addEnvironmentalVariable(`FEAT__PORT__${portId.toUpperCase()}`, port);
                    }
                );
                _.each(
                    buildInstance.featVariables,
                    (value, name) => {
                        buildInstance.addEnvironmentalVariable(`FEAT__${name.toUpperCase()}`, value)
                    }
                );
                _.each(
                    buildInstance.config.environmentalVariables,
                    (value, name) => {
                        buildInstance.addEnvironmentalVariable(
                            name,
                            interpolationHelper.interpolateText(value, buildInstance.featVariables, buildInstance.externalPorts)
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
