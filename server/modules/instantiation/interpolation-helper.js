let _ = require('underscore');
let fs = require('fs-extra');
let escapeStringRegexp = require('escape-string-regexp');
let parse = require('esprima').parse;
let evaluate = require('static-eval');

module.exports = function (config) {

    function interpolateText(text, build) {
        let exposedPorts = {};

        for (let serviceId in build.services) {
            for (let exposedPort of build.services[serviceId].exposedPorts) {
                exposedPorts[exposedPort.id] = exposedPort;
            }
        }

        function getExposedPort(id) {
            let exposedPort = exposedPorts[id];

            if (!exposedPort) {
                throw new Error(`Exposed port ${id} not found.`);
            }

            return exposedPort;
        }

        let interpolatedFunctions = {
            exposed_port_url: id => {
                return `http://${getExposedPort(id).domains.short}:${config.app.port}`;
            },
            exposed_port_domain: id => {
                return getExposedPort(id).domains.short;
            }
        };

        text = text.replace(
            new RegExp(`${escapeStringRegexp('{{@')}(.+?)${escapeStringRegexp('@}}')}`, 'g'),
            match => {
                return evaluate(
                    parse(match.substr(3, match.length - 6)).body[0].expression,
                    interpolatedFunctions
                );
            }
        );

        text = _.reduce(
            _.keys(build.featVariables),
            (text, name) => {
                return text.replace(
                    new RegExp(escapeStringRegexp(`{{{${name}}}}`), 'g'),
                    build.featVariables[name]
                )
            },
            text
        );

        return text;
    }

    function interpolateFile(fullPath, build) {
        let contents = fs.readFileSync(fullPath).toString();

        contents = interpolateText(contents, build);
        fs.truncateSync(fullPath);
        fs.writeFileSync(fullPath, contents);
    }

    return {
        interpolateText,
        interpolateFile
    };

};
