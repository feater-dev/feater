var path = require('path');
var _ = require('underscore');

module.exports = function (config, instanceClasses, jobs) {

    var { BuildInstance, ComponentInstance } = instanceClasses;

    var dummyFeatVariables = {
        'scheme': 'http',
        'domain': 'localhost',
        'npm_cache': path.join(__dirname, '../../../cache/npm'), // TODO Move this to config.
        'composer_cache': path.join(__dirname, '/../../../cache/composer') // TODO Move this to config.
    };

    function createBuildInstance(buildInstanceId, buildDefinition) {
        var buildInstance = new BuildInstance(
            buildInstanceId,
            buildDefinition.config,
            path.join(__dirname, '../../../buildInstances', buildInstanceId.toString()) // TODO Move this to config.
        );

        buildInstance.log('About to set up.');

        var componentIds = _.keys(buildDefinition.config.components);

        buildInstance.log('Setting dummy Feat variables.');

        _.each(dummyFeatVariables, (value, name) => {
            buildInstance.addFeatVariable(name, value);
        });

        _.map(componentIds, (componentId) => {
            var componentInstance = new ComponentInstance(
                componentId,
                buildInstance,
                buildDefinition.config.components[componentId]
            );

            componentInstance.log('Set up.')
        });

        buildInstance.log('Set up.');

        return buildInstance;
    }

    function executeJobsForBuildInstance(buildInstance) {
        buildInstance.log('About to execute jobs.');

        return jobs
            .createBuildInstanceDependantJobsExecutor(buildInstance)
            .execute()
            .then(
                () => { buildInstance.log('Jobs executed.'); },
                () => { buildInstance.log('Some jobs failed.'); }
            );
    }

    return {
        createBuildInstance,
        executeJobsForBuildInstance
    };

};
