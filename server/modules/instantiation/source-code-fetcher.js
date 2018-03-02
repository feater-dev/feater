var path = require('path');
var _ = require('underscore');

module.exports = function (config, buildClasses, instantiation) {

    let { Build, Source } = buildClasses;

    let featVariables = {
        'scheme': config.web.scheme,
        'host': config.web.host,
        'port': config.web.port,
        'npm_cache': config.hostPaths.npmCache,
        'composer_cache': config.hostPaths.composerCache
    };

    function createBuild(id, shortid, buildDefinition) {
        let build = new Build(id, shortid, buildDefinition.config);

        build.log('Setting up build.');

        build.log('Setting up sources.');

        _.map(_.keys(buildDefinition.config.sources), sourceId => {
            new Source(sourceId, build, buildDefinition.config.sources[sourceId]);
        });

        build.log('Setting basic Feat variables.');

        _.each(featVariables, (value, name) => {
            build.addFeatVariable(name, value);
        });

        return build;
    }

    function instantiateBuild(build) {
        build.log('Instantiating build.');

        return instantiation
            .instantiateBuild(build)
            .then(
                () => {
                    build.log('Build instantiated and started.');
                },
                error => {
                    build.log('Failed to instantiate and start build.');
                }
            );
    }

    return {
        createBuild,
        instantiateBuild
    };

};
