var _ = require('underscore');

module.exports  = function () {

    class PromiseRunner {

        constructor(createPromiseCallbacks) {
            this.createPromiseCallbacks = createPromiseCallbacks;
        }

        createPromise(nestedPromise) {
            return new Promise((resolve, reject) => {
                if (!nestedPromise) {
                    resolve();

                    return;
                }

                nestedPromise.then(resolve, reject);
            });
        }

        runInSequence() {
            let lastNestedPromise;

            _.each(this.createPromiseCallbacks, (createPromiseCallback) => {
                if (!lastNestedPromise) {
                    lastNestedPromise = createPromiseCallback();
                } else {
                    lastNestedPromise = lastNestedPromise.then(createPromiseCallback);
                }
            });

            return this.createPromise(lastNestedPromise);
        }

        runInParallel() {
            return this.createPromise(
                Promise.all(
                    _.map(this.createPromiseCallbacks, (createPromiseCallback) => {
                        return createPromiseCallback();
                    })
                )
            );
        }

    }

    class JobRunner {

        constructor(jobExecutorCollection, jobs) {
            this.jobs = jobs;
            this.jobExecutorCollection = jobExecutorCollection;
        }

        createPromise(nestedPromise) {
            return new Promise((resolve, reject) => {
                nestedPromise.then(resolve, reject);
            });
        }

        createPromiseRunner() {
            let executeJobCallbacks = _.map(this.jobs, (job) => {
                return () => {
                    return this.jobExecutorCollection.getSupporting(job).execute(job);
                };
            });

            return new PromiseRunner(executeJobCallbacks);
        }

        runInSequence() {
            return this.createPromise(
                this.createPromiseRunner().runInSequence()
            );
        }

        runInParallel() {
            return this.createPromise(
                this.createPromiseRunner().runInParallel()
            );
        }


    }

    return {
        PromiseRunner,
        JobRunner
    };

};
