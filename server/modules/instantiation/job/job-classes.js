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

    class BuildJob extends Job {
        constructor(build) {
            super();
            this.build = build;
        }

        toString() {
            return `${this.constructor.name} for build ${this.build.id}`
        }
    }

    class SourceJob extends Job {
        constructor(source) {
            super();
            this.source = source;
        }

        toString() {
            return `${this.constructor.name} for build ${this.source.build.id} and source ${this.source.id}`;
        }
    }

    class JobExecutor {}

    return {
        BuildJob,
        SourceJob,
        JobExecutor
    };
};
