var container = require('kontainer-di');

module.exports = function (app, rawConfig, modules) {

    container.register('app', [], function () {
        return app;
    });

    container.register('config', [], function () {
        var config = {
            app: {
                versionNumber: rawConfig.app.versionNumber,
                scheme: rawConfig.app.scheme,
                host: rawConfig.app.host,
                port: parseInt(rawConfig.app.port, 10)
            },
            ports: {
                translation: parseInt(rawConfig.ports.translation, 10)
            },
            mongo: {
                dsn: rawConfig.mongo.dsn
            },
            github: {
                debugMode: !!rawConfig.github.debugMode,
                personalAccessToken: rawConfig.github.personalAccessToken
            },
            paths: {
                repositoryCache: rawConfig.paths.repositoryCache,
                build: rawConfig.paths.build,
                domain: rawConfig.paths.domain
            },
            hostPaths: {
                build: rawConfig.hostPaths.build,
                composerCache: rawConfig.hostPaths.composerCache,
                npmCache: rawConfig.hostPaths.npmCache
            },
            googleOAuth2: {
                clientId: rawConfig.googleOAuth2.clientId,
                clientSecret: rawConfig.googleOAuth2.clientSecret,
                allowedDomains: rawConfig.googleOAuth2.allowedDomains
            }
        };

        config.app.baseUrl = config.app.scheme + '://' + config.app.host + ':' + config.app.port;

        config.app.hostAndPort = config.app.host;
        if (
            'http' === config.app.scheme && 80 !== config.app.port
            || 'https' === config.app.scheme && 443 !== config.app.port
        ) {
            config.app.hostAndPort += `:${config.app.port}`;
        }

        return config;
    });

    modules.forEach(({ name, dependencies, module })=> {
        container.registerModule(name, dependencies, module);
    });

    return container;

};
