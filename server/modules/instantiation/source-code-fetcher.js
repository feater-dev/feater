var path = require('path');
var _ = require('underscore');

module.exports = function (config, instanceClasses, jobs) {

    let { BuildInstance, ComponentInstance } = instanceClasses;

    let featVariables = {
        'scheme': config.web.scheme,
        'host': config.web.host,
        'port': config.web.port,
        'npm_cache': config.hostPaths.npmCache,
        'composer_cache': config.hostPaths.composerCache
    };

    function createBuildInstance(id, shortid, buildDefinition) {
        let buildInstance = new BuildInstance(
            id,
            shortid,
            buildDefinition.config
        );

        buildInstance.log('Setting up build instance.');

        let componentIds = _.keys(buildDefinition.config.components);

        buildInstance.log('Setting basic Feat variables.');

        _.each(featVariables, (value, name) => {
            buildInstance.addFeatVariable(name, value);
        });

        _.map(componentIds, componentId => {
            var componentInstance = new ComponentInstance(
                componentId,
                buildInstance,
                buildDefinition.config.components[componentId]
            );
        });

        return buildInstance;
    }

    function executeJobsForBuildInstance(buildInstance) {
        buildInstance.log('About to execute jobs.');

        return jobs
            .startBuildInstance(buildInstance)
            .then(
                () => {
                    buildInstance.log('Build instance started.');
                },
                error => {
                    buildInstance.log('Build instance failed to start.');
                }
            );
    }

    return {
        createBuildInstance,
        executeJobsForBuildInstance
    };

};
