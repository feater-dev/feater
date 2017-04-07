require('any-promise/register/bluebird');

var portfinder = require('portfinder');
var Promise = require('any-promise');

module.exports = function () {

    class PortRange {
        constructor(minPort, maxPort) {
            this.minPort = minPort;
            this.maxPort = maxPort;
        }

        contains(port) {
            return !(port < this.minPort || port > this.maxPort);
        }
    }

    class PortRangeCollection {
        constructor() {
            this.portRanges = [];
        }

        add(portRange) {
            this.portRanges.push(portRange);

            return this;
        }

        contains(port) {
            for (var i = 0; i < this.portRanges.length; i += 1) {
                if (this.portRanges[i].contains(port)) {
                    return true;
                }
            }

            return false;
        }
    }

    class PortProvider {
        constructor() {
            this.availablePortRanges = new PortRangeCollection();
            this.availablePortRanges.add(new PortRange(1, 65535)); // todo move to app config
        }

        addAvailablePortRange(minPort, maxPort) {
            this.availablePortRanges.add(new PortRange(minPort, maxPort));

            return this;
        }

        addExternalPortRange(minPort, maxPort) {
            this.externalPortRanges.add(new PortRange(minPort, maxPort));

            return this;
        }

        providePort(expectedPortRanges) {
            return Promise
                .any(expectedPortRanges.map(portRange => this.findPort(portRange)))
                .catch(_ => new Error('Failed to allocate port.'));
        }

        findPort(portRange) {
            portfinder.basePort = portRange.minPort;

            return new Promise((resolve, reject) => {
                portfinder.getPortPromise()
                    .then(port => {
                        if (this.availablePortRanges.contains(port) && portRange.contains(port)) {
                            resolve(port);

                            return;
                        }

                        reject(new Error('Couldn\'t find any available unallocated port in given range'));
                    })
            });
        }
    }

    return {
        PortRange,
        PortProvider
    };
}
