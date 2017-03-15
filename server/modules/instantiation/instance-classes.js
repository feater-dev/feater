const path = require('path');
const _ = require('underscore');

module.exports = consoleLogger => {

    class BuildInstance {
        constructor(id, buildDefinitionConfig) {
            this.id = id;
            this.config = buildDefinitionConfig;

            this.logger = consoleLogger.createNested(`Build instance ${this.id}`);

            this.componentInstances = {};
            this.featVariables = {};
            this.externalPorts = {};
            this.environmentalVariables = {};
            this.summaryItems = [];
        }

        // fullPath

        addComponentInstance(componentInstance) {
            this.componentInstances[componentInstance.id] = componentInstance;

            return this;
        }

        addFeatVariable(name, value) {
            this.featVariables[name] = value;

            return this;
        }

        addExternalPort(name, port) {
            this.externalPorts[name] = port;

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

    class ComponentInstance {
        constructor(id, buildInstance, buildDefinitionComponentConfig) {
            this.id = id;
            this.buildInstance = buildInstance;
            this.buildInstance.addComponentInstance(this);
            this.config = buildDefinitionComponentConfig;

            this.logger = this.buildInstance.logger.createNested(`Component ${this.id}`);
        }

        // resolvedReference
        // relativePath
        // zipFileUrl
        // zipFileFullPath

        log(message) {
            this.logger.info(message);
        }

        get fullPath() {
            return path.join(this.buildInstance.fullPath, this.relativePath);
        }
    }

    return {
        BuildInstance,
        ComponentInstance
    };
};
