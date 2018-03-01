var path = require('path');
var _ = require('underscore');

module.exports = function (consoleLogger) {

    class BuildInstance {
        constructor(id, shortid, config) {
            this.id = id;
            this.shortid = shortid;
            this.config = config;

            this.logger = consoleLogger.createNested(`build ${this.shortid}`);

            this.componentInstances = {};
            this.featVariables = {};
            this.exposedPorts = {};
            this.interpolatedTokens = {};
            this.environmentalVariables = {};
            this.summaryItems = [];
        }

        // fullBuildPath
        // fullBuildHostPath

        addComponentInstance(componentInstance) {
            this.componentInstances[componentInstance.id] = componentInstance;

            return this;
        }

        addFeatVariable(name, value) {
            this.featVariables[name] = value;

            return this;
        }

        addExternalPort(name, port) {
            this.exposedPorts[name] = port;

            return this;
        }

        addInterpolatedToken(name, value) {
            this.interpolatedTokens[name] = value;
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

    class ComponentInstance {
        constructor(id, buildInstance, config) {
            this.id = id;
            this.buildInstance = buildInstance;
            this.buildInstance.addComponentInstance(this);
            this.config = config;

            this.logger = this.buildInstance.logger.createNested(`component ${this.id}`);
        }

        // resolvedReference
        // relativePath
        // zipFileUrl
        // zipFileFullPath

        log(message) {
            this.logger.info(message);
        }

        get fullBuildPath() {
            return path.join(this.buildInstance.fullBuildPath, this.relativePath);
        }

        get fullBuildHostPath() {
            return path.join(this.buildInstance.fullBuildHostPath, this.relativePath);
        }
    }

    return {
        BuildInstance,
        ComponentInstance
    };
};
