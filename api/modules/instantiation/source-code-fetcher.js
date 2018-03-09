var _ = require('underscore');

module.exports = function (config, buildClasses, instantiation) {

    let { Build, Source } = buildClasses;

    let featVariables = {
        'scheme': config.app.scheme,
        'host': config.app.host,
        'port': config.app.port,
        'npm_cache': config.hostPaths.npmCache,
        'composer_cache': config.hostPaths.composerCache
    };

    function createBuild(id, hash, buildDefinition) {
        let build = new Build(id, hash, buildDefinition.config);

        console.log('Setting up build.');

        console.log('Setting up sources.');

        _.map(_.keys(buildDefinition.config.sources), sourceId => {
            new Source(sourceId, build, buildDefinition.config.sources[sourceId]);
        });

        console.log('Setting basic Feat variables.');

        _.each(featVariables, (value, name) => {
            build.addFeatVariable(name, value);
        });

        return build;
    }

    function instantiateBuild(build) {
        console.log('Instantiating build.');

        return instantiation
            .instantiateBuild(build)
            .then(
                () => {
                    console.log('Build instantiated and started.');
                },
                error => {
                    console.log(error);
                    console.log('Failed to instantiate and start build.');
                }
            );
    }

    return {
        createBuild,
        instantiateBuild
    };

};
