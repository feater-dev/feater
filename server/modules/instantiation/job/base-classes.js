module.exports = function () {

    class Job {
        setResult(result) {
            this.result = result;

            return this;
        }

        getResult() {
            return this.result;
        }
    }

    class BuildInstanceJob extends Job {
        constructor(buildInstance) {
            super();
            this.buildInstance = buildInstance;
        }

        toString() {
            return `${this.constructor.name} for build ${this.buildInstance.id}`
        }
    }

    class ComponentInstanceJob extends Job {
        constructor(componentInstance) {
            super();
            this.componentInstance = componentInstance;
        }

        toString() {
            return `${this.constructor.name} for build ${this.componentInstance.buildInstance.id} and component ${this.componentInstance.id}`;
        }
    }

    class JobExecutor {}

    return {
        BuildInstanceJob,
        ComponentInstanceJob,
        JobExecutor
    };
};
