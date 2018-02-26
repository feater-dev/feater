var container = require('kontainer-di');

module.exports = function (app, rawConfig, modules) {

    container.register('app', [], function () {
        return app;
    });

    container.register('config', [], function () {
        var config = {
            app: {
                versionNumber: rawConfig.app.versionNumber
            },
            web: {
                scheme: rawConfig.web.scheme,
                host: rawConfig.web.host,
                port: +rawConfig.web.port
            },
            mongo: {
                dsn: rawConfig.mongo.dsn
            },
            github: {
                debugMode: !!rawConfig.github.debugMode,
                personalAccessToken: rawConfig.github.personalAccessToken
            },
            paths: {
                build: rawConfig.paths.build,
                buildVolume: rawConfig.paths.buildVolume,
                composerCacheVolume: rawConfig.paths.composerCacheVolume,
                githubCacheVolume: rawConfig.paths.githubCacheVolume,
                npmCacheVolume: rawConfig.paths.npmCacheVolume
            },
            googleOAuth2: {
                clientId: rawConfig.googleOAuth2.clientId,
                clientSecret: rawConfig.googleOAuth2.clientSecret,
                allowedDomains: rawConfig.googleOAuth2.allowedDomains
            }
        };

        config.web.baseUrl = config.web.scheme + '://' + config.web.host + ':' + config.web.port;

        return config;
    });

    modules.forEach(({ name, dependencies, module })=> {
        container.registerModule(name, dependencies, module);
    });

    return container;

};
