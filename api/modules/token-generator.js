var randToken = require('rand-token');

module.exports = {
    generate: function () {
        return randToken.generate(16);
    }
};
