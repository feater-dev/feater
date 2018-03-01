var _ = require('underscore');
var fs = require('fs-extra');
var escapeStringRegexp = require('escape-string-regexp');

module.exports = function () {

    function interpolateText(text, featVariables = {}, exposedPorts = {}) {
        text = _.reduce(
            _.keys(featVariables),
            (text, name) => {
                return text.replace(
                    new RegExp(escapeStringRegexp(`{{{${name}}}}`), 'g'),
                    featVariables[name]
                )
            },
            text
        );

        text = _.reduce(
            _.keys(exposedPorts),
            (text, portId) => text.replace(
                new RegExp(escapeStringRegexp(`{{{port.${portId}}}}`), 'g'),
                exposedPorts[portId]
            ),
            text
        );

        return text;
    }

    function interpolateFile(fullPath, featVariables = {}, exposedPorts = {}) {
        let contents = fs.readFileSync(fullPath).toString();
        contents = interpolateText(contents, featVariables, exposedPorts);
        fs.truncateSync(fullPath);
        fs.writeFileSync(fullPath, contents);
    }

    return {
        interpolateText,
        interpolateFile
    };

};
