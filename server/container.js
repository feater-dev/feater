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
                port: parseInt(rawConfig.web.port, 10)
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

        config.web.baseUrl = config.web.scheme + '://' + config.web.host + ':' + config.web.port;

        config.web.hostAndPort = config.web.host;
        if (
            'http' === config.web.scheme && 80 !== config.web.port
            || 'https' === config.web.scheme && 443 !== config.web.port
        ) {
            config.web.hostAndPort += `:${config.web.port}`;
        }

        return config;
    });

    modules.forEach(({ name, dependencies, module })=> {
        container.registerModule(name, dependencies, module);
    });

    return container;

};
