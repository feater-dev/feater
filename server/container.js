var container = require('kontainer-di');
var path = require('path');

module.exports = function (app, rawConfig, modules) {

    container.register('app', [], function () {
        return app;
    });

    container.register('config', [], function () {
        const generateInstanceDirectoryPath = (instancesDirectory) =>
            path.isAbsolute(instancesDirectory)
                ?  instancesDirectory
                : path.resolve(__dirname, '..', instancesDirectory)

        var config = {
            app: {
                versionNumber: rawConfig.app.versionNumber
            },
            web: {
                scheme: rawConfig.web.scheme,
                host: rawConfig.web.host,
                port: +rawConfig.web.port
            },
            build: {
              instancesDirectory: generateInstanceDirectoryPath(rawConfig.build.instancesDirectory)
            },
            mongo: {
                dsn: rawConfig.mongo.dsn
            },
            github: {
                debugMode: !!rawConfig.github.debugMode,
                personalAccessToken: rawConfig.github.personalAccessToken
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
