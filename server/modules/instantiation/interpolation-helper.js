let _ = require('underscore');
let fs = require('fs-extra');
let escapeStringRegexp = require('escape-string-regexp');

module.exports = function () {

    function interpolateText(text, featVariables = {}) {
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

        return text;
    }

    function interpolateFile(fullPath, featVariables = {}) {
        let contents = fs.readFileSync(fullPath).toString();
        contents = interpolateText(contents, featVariables);
        fs.truncateSync(fullPath);
        fs.writeFileSync(fullPath, contents);
    }

    return {
        interpolateText,
        interpolateFile
    };

};
