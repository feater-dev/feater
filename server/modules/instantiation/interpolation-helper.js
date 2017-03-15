const _ = require('underscore');
const fs = require('fs-extra');
const escapeStringRegexp = require('escape-string-regexp');

module.exports = () => {

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
        let contents = fs.readFileSync(fullPath).toString();
        contents = interpolateText(contents, featVariables, externalPorts);
        fs.truncateSync(fullPath);
        fs.writeFileSync(fullPath, contents);
    }

    return {
        interpolateText,
        interpolateFile
    };

};
