var moment = require('moment');

module.exports = function () {

    class ConsoleLogger {
        log(level, message) {
            console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} | ${level} | ${message}`);
        }
        createNested(prefix, options = { splitLines: false }) {
            return new Logger(prefix, this, options);
        }
    }

    class Logger {
        constructor(prefix, parent, { splitLines }) {
            this.prefix = prefix;
            this.parent = parent;
            this.splitLines = splitLines;
        }
        log(level, message) {
            // TODO Filter by level.
            var messages = this.splitLines ? message.replace(/\n$/gm, '').split('\n') : [message];
            messages.forEach((message) => {
                this.parent.log(level, `${this.prefix} | ${message}`)
            });
        }
        debug(message) {
            this.log('debug', message);
        }
        info(message) {
            this.log('info', message);
        }
        notice(message) {
            this.log('notice', message);
        }
        warning(message) {
            this.log('warning', message);
        }
        error(message) {
            this.log('error', message);
        }
        critical(message) {
            this.log('critical', message);
        }
        alert(message) {
            this.log('alert', message);
        }
        emergency(message) {
            this.log('emergency', message);
        }
        createNested(prefix, options = { splitLines: false }) {
            return new Logger(prefix, this, options);
        }
    }

    return new ConsoleLogger();
};
