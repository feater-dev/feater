let _ = require('underscore');
let fs = require('fs-extra');
let escapeStringRegexp = require('escape-string-regexp');
let parse = require('esprima').parse;
let evaluate = require('static-eval');

const tokenDelimiters = ['{{{', '}}}'];
const expressionDelimiters = ['{{@', '@}}'];

module.exports = function (config) {

    function getExposedPort(allExposedPorts, id) {
        let exposedPort = allExposedPorts[id];

        if (!exposedPort) {
            throw new Error(`Exposed port ${id} not found.`);
        }

        return exposedPort;
    }

    function interpolateExpressions(text, build) {
        let allExposedPorts = {};

        for (let serviceId in build.services) {
            for (let exposedPort of build.services[serviceId].exposedPorts) {
                allExposedPorts[exposedPort.id] = exposedPort;
            }
        }

        let interpolatedFunctions = {
            proxy_url: id => {
                return `http://${getExposedPort(allExposedPorts, id).proxyDomains.short}:${config.app.port}`;
            },
            proxy_domain: id => {
                return getExposedPort(allExposedPorts, id).proxyDomains.short;
            }
        };

        let expressionRegExp = new RegExp(
            `${escapeStringRegexp(expressionDelimiters[0])}(.+?)${escapeStringRegexp(expressionDelimiters[1])}`,
            'g'
        );

        return text.replace(
            expressionRegExp,
            match => {
                return evaluate(
                    parse(match.substr(3, match.length - 6)).body[0].expression,
                    interpolatedFunctions
                );
            }
        );
    }

    function interpolateTokens(text, build) {
        return _.reduce(
            _.keys(build.featVariables),
            (text, name) => {
                let tokenRegExp = new RegExp(
                    escapeStringRegexp(`${tokenDelimiters[0]}${name}${tokenDelimiters[1]}`),
                    'g'
                );

                return text.replace(
                    tokenRegExp,
                    build.featVariables[name]
                )
            },
            text
        );
    }

    function interpolateText(text, build) {
        text = interpolateExpressions(text, build);
        text = interpolateTokens(text, build);

        return text;
    }

    function interpolateFile(fullPath, build) {
        let text = fs.readFileSync(fullPath).toString();

        text = interpolateText(text, build);

        fs.truncateSync(fullPath);
        fs.writeFileSync(fullPath, text);
    }

    return {
        interpolateText,
        interpolateFile
    };

};
