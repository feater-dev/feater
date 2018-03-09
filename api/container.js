let container = require('kontainer-di');
let configParser = require('./config-parser');

module.exports = function (app, rawConfig, modules) {

    container.register('app', [], function () { return app; });

    container.register('config', [], configParser(rawConfig));

    modules.forEach(({ name, dependencies, implementation })=> {
        container.registerModule(name, dependencies, implementation);
    });

    return container;

};
