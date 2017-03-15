module.exports = () => {

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
            for (let i = 0; i < this.portRanges.length; i += 1) {
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
            this.externalPortRanges = new PortRangeCollection();
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
            let i;
            let port;
            for (i = 0; i < expectedPortRanges.length; i += 1) {
                for (port = expectedPortRanges[i].minPort; port <= expectedPortRanges[i].maxPort; port += 1) {
                    if (this.availablePortRanges.contains(port) && !this.externalPortRanges.contains(port)) {
                        this.addExternalPortRange(port, port);

                        return port;
                    }
                }
            }

            throw new Error('Failed to allocate port.');
        }
    }

    const portProvider = new PortProvider();

    portProvider
        .addAvailablePortRange(1000, 1005) // TODO Move to config.
        .addAvailablePortRange(1010, 1099)
        .addAvailablePortRange(3320, 3400)
        .addAvailablePortRange(8000, 8100);

    return portProvider;
}
