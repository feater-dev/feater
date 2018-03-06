var path = require('path');
var _ = require('underscore');

module.exports = function (consoleLogger) {

    class Build {
        constructor(id, shortid, config) {
            this.id = id;
            this.shortid = shortid;
            this.config = config;

            this.logger = consoleLogger.createNested(`build ${this.shortid}`);

            this.sources = {};
            this.featVariables = {};
            this.exposedPorts = {};
            this.environmentalVariables = {};
            this.summaryItems = [];
        }

        // fullBuildPath
        // fullBuildHostPath

        addSource(source) {
            this.sources[source.id] = source;

            return this;
        }

        addFeatVariable(name, value) {
            this.featVariables[name] = value;

            return this;
        }

        addExternalPort(exposedPort) {
            this.exposedPorts[id] = exposedPort;

            return this;
        }

        addEnvironmentalVariable(name, value) {
            this.environmentalVariables[name] = value;

            return this;
        }

        getEnvironmentalVariablesString() {
            return _.map(
                this.environmentalVariables,
                (value, name) => `${name}=${value}`
            ).join(' ');
        }

        addSummaryItem(name, value) {
            this.summaryItems.push({ name, value });

            return this;
        }

        log(message) {
            this.logger.info(message);
        }
    }

    class Source {
        constructor(id, build, config) {
            this.id = id;
            this.build = build;
            this.build.addSource(this);
            this.config = config;

            this.logger = this.build.logger.createNested(`source ${this.id}`);
        }

        // resolvedReference
        // relativePath
        // zipFileUrl
        // zipFileFullPath

        log(message) {
            this.logger.info(message);
        }

        get fullBuildPath() {
            return path.join(this.build.fullBuildPath, this.relativePath);
        }

        get fullBuildHostPath() {
            return path.join(this.build.fullBuildHostPath, this.relativePath);
        }

        get containerIds() {
            let containerIds = [];

            for (let serviceId in this.services) {
                containerIds.push(this.services[serviceId].containerId);
            }

            return containerIds;
        }
    }

    return {
        Build: Build,
        Source: Source
    };
};
