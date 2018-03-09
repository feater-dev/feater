const path = require('path');
const { EnvironmentalVariablesSet } = require('./environmental-variables-set');
const { SummaryItemsSet } = require('./summary-items-set');

module.exports = function () {

    class Build {
        constructor(id, hash, config) {
            this.id = id;
            this.hash = hash;
            this.config = config;

            this.sources = {};
            this.services = {};
            this.featVariables = {};
            this.environmentalVariables = new EnvironmentalVariablesSet();
            this.summaryItems = new SummaryItemsSet();
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

        toDocument() {
            return {
                hash: this.hash,
                sources: this.sources,
                services: this.services,
                featVariables: this.featVariables,
                environmentalVariables: this.environmentalVariables.items,
                summaryItems: this.summaryItems.items
            }
        }
    }

    class Source {
        constructor(id, build, config) {
            this.id = id;
            this.build = build;
            this.build.addSource(this);
            this.config = config;
        }

        // resolvedReference
        // relativePath
        // zipFileUrl
        // zipFileFullPath

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
