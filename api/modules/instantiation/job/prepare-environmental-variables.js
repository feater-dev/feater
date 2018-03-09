var _ = require('underscore');

module.exports = function (jobClasses, interpolationHelper, buildRepository) {

    var { BuildJob, JobExecutor } = jobClasses;

    class PrepareEnvironmentalVariablesJob extends BuildJob {}

    class PrepareEnvironmentalVariablesJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof PrepareEnvironmentalVariablesJob);
        }

        execute(job) {
            var { build } = job;

            return new Promise(resolve => {
                _.each(
                    build.sources,
                    (source, sourceId) => {
                        build.environmentalVariables.add(`FEAT__BUILD_PATH__${sourceId.toUpperCase()}`, source.fullBuildPath);
                        build.environmentalVariables.add(`FEAT__VOLUME_PATH__${sourceId.toUpperCase()}`, source.fullBuildHostPath);
                    }
                );

                _.each(
                    build.featVariables,
                    (value, name) => {
                        build.environmentalVariables.add(`FEAT__${name.replace(/\./g, '__').toUpperCase()}`, value)
                    }
                );

                _.each(
                    build.config.environmentalVariables,
                    (value, name) => {
                        build.environmentalVariables.add(
                            name,
                            interpolationHelper.interpolateText(value, build.featVariables)
                        )
                    }
                );

                buildRepository
                    .updateEnvironmentalVariables(build)
                    .then(resolve());
            });
        }
    }

    return {
        PrepareEnvironmentalVariablesJob,
        PrepareEnvironmentalVariablesJobExecutor
    };

};
