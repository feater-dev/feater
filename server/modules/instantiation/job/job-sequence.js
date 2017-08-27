var _ = require('underscore');
var Promise = require('bluebird');

module.exports  = function () {

    class PromiseRunner {

        constructor(createPromiseCallbacks) {
            this.createPromiseCallbacks = createPromiseCallbacks;
        }

        getPromise() {
            if (!this.promise) {
                this.promise = new Promise((resolve, reject) => {
                    this.resolvePromise = resolve;
                    this.rejectPromise = reject;
                });
            }

            return this.promise;
        }

        runInSequence() {
            let promise = this.getPromise();
            let lastPromise;

            if (0 === this.createPromiseCallbacks.length) {
                this.resolvePromise();
            }

            _.each(this.createPromiseCallbacks, (createPromiseCallback) => {
                if (!lastPromise) {
                    lastPromise = createPromiseCallback();
                } else {
                    lastPromise = lastPromise.then(createPromiseCallback);
                }
            });

            lastPromise.then(this.resolvePromise, this.rejectPromise);

            return promise;
        }

        runInParallel() {
            let promise = this.getPromise();

            if (0 === this.createPromiseCallbacks.length) {
                this.resolvePromise();
            }

            Promise
                .all(
                    _.map(this.createPromiseCallbacks, (createPromiseCallback) => {
                        return createPromiseCallback();
                    })
                )
                .then(this.resolvePromise, this.rejectPromise);

            return promise;
        }

    }

    class JobRunner {

        constructor(jobExecutorCollection, jobs) {
            this.jobs = jobs;
            this.jobExecutorCollection = jobExecutorCollection;
        }

        getPromise() {
            if (!this.promise) {
                this.promise = new Promise((resolve, reject) => {
                    this.resolvePromise = resolve;
                    this.rejectPromise = reject;
                });
            }

            return this.promise;
        }

        createExecuteJobCallbacks() {
            return _.map(this.jobs, (job) => {
                return () => {
                    return this.jobExecutorCollection.getSupporting(job).execute(job);
                };
            });
        }

        runInSequence() {
            let executeJobCallbacks = this.createExecuteJobCallbacks();
            let promiseRunner = new PromiseRunner(executeJobCallbacks);
            let promise = this.getPromise();

            promiseRunner
                .runInSequence()
                .then(this.resolvePromise, this.rejectPromise);

            return promise;
        }

        runInParallel() {
            let executeJobCallbacks = this.createExecuteJobCallbacks();
            let promiseRunner = new PromiseRunner(executeJobCallbacks);
            let promise = this.getPromise();

            promiseRunner
                .runInParallel()
                .then(this.resolvePromise, this.rejectPromise);

            return promise;
        }

    }

    return {
        PromiseRunner,
        JobRunner
    };

};
