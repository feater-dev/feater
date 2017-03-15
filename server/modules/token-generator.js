const randToken = require('rand-token');

module.exports = {
    generate() {
        return randToken.generate(16);
    }
};
