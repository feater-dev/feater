var _ = require('underscore');
var fs = require('fs-extra');
var escapeStringRegexp = require('escape-string-regexp');

module.exports = function () {

    function interpolateText(text, featVariables = {}, externalPorts = {}) {
        text = _.reduce(
            _.keys(featVariables),
            (text, name) => text.replace(
                new RegExp(escapeStringRegexp(`{{{${name}}}}`), 'g'),
                featVariables[name]
            ),
            text
        );

        text = _.reduce(
            _.keys(externalPorts),
            (text, portId) => text.replace(
                new RegExp(escapeStringRegexp(`{{{port.${portId}}}}`), 'g'),
                externalPorts[portId]
            ),
            text
        );

        return text;
    }

    function interpolateFile(fullPath, featVariables = {}, externalPorts = {}) {
        var contents = fs.readFileSync(fullPath).toString();
        contents = interpolateText(contents, featVariables, externalPorts);
        fs.truncateSync(fullPath);
        fs.writeFileSync(fullPath, contents);
    }

    return {
        interpolateText,
        interpolateFile
    };

};
