var _ = require('underscore');
var path = require('path');
var fs = require('fs-extra');
var Promise = require('bluebird');

module.exports = function () {

    class ObjectMapEntry {
        constructor(key, value) {
            this.key = key;
            this.value = value;
        }
    }

    class ObjectMap {
        constructor() {
            this.entries = []
        }

        has(key) {
            for (var i = 0; i < this.entries.length; i += 1) {
                if (this.entries[i].key === key) {
                    return true;
                }
            }

            return false;
        }

        keys() {
            return _.map(this.entries, (entry) => {
                return entry.key;
            });
        }

        set(key, value) {
            if (this.has(key)) {
                throw new Error(`Failed to set key ${key}.`);
            }
            this.entries.push(new ObjectMapEntry(key, value));

            return this;
        }

        get(key) {
            for (var i = 0; i < this.entries.length; i += 1) {
                if (this.entries[i].key === key) {
                    return this.entries[i].value;
                }
            }

            throw new Error(`Failed to get value for key ${key}.`);
        }
    }

    class JobExecutorCollection {
        constructor() {
            this.jobExecutors = [];
        }

        add(jobExecutor) {
            this.jobExecutors.push(jobExecutor);

            return this;
        }

        getSupporting(job) {
            var supportingJobExecutors = _.filter(
                this.jobExecutors,
                (jobExecutor) => jobExecutor.supports(job)
            );
            if (0 === supportingJobExecutors.length) {
                throw new Error(`No supporting job executor for job ${job.toString()}.`);
            }
            if (supportingJobExecutors.length > 1) {
                throw new Error(`More than one supporting job executor for job ${job.toString()}.`);
            }

            return supportingJobExecutors[0];
        }
    }

    class DependantJobsExecutor {
        constructor(jobExecutorCollection) {
            this.jobExecutorCollection = jobExecutorCollection;

            this.jobToRequiredJobsMap = new ObjectMap();
            this.jobToPromiseMap = new ObjectMap();
            this.pendingJobsCount = 0;
        }

        add(job, requiredJobs = []) {
            if (this.jobToRequiredJobsMap.has(job)) {
                throw new Error(`Job already added.`);
            }
            this.jobToRequiredJobsMap.set(job, requiredJobs);
        }

        assertJobDependenciesConsistency() {
            this.jobToRequiredJobsMap.keys().forEach((job) => {
                this.jobToRequiredJobsMap.get(job).forEach((requiredJob) => {
                    if (!this.jobToRequiredJobsMap.has(requiredJob)) {
                        throw new Error('Inconsistent required job.');
                    }
                });
            });
        }

        findExecutableJobs() {
            return _.filter(
                this.jobToRequiredJobsMap.keys(),
                (job) => {
                    var requiredJobs;

                    // First check if job is already fulfilled, rejected or cancelled.
                    if (this.jobToPromiseMap.has(job)) {
                        return false;
                    }

                    // Then check if its required jobs are all fulfilled.
                    requiredJobs = this.jobToRequiredJobsMap.get(job);
                    for (var i = 0; i < requiredJobs.length; i += 1) {
                        if (
                            !this.jobToPromiseMap.has(requiredJobs[i])
                            || !this.jobToPromiseMap.get(requiredJobs[i]).isFulfilled()
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );
        }

        areAllJobsExecuted() {
            var notExecutedJobs = _.filter(
                this.jobToRequiredJobsMap.keys(),
                (job) => {
                    return (
                        !this.jobToPromiseMap.has(job)
                        || !this.jobToPromiseMap.get(job).isFulfilled()
                    );
                }
            );

            return (notExecutedJobs.length === 0);
        }

        increasePendingJobsCount() {
            this.pendingJobsCount += 1;

            return this;
        }

        decreasePendingJobsCount() {
            this.pendingJobsCount -= 1;

            return this;
        }

        hasPendingJobs() {
            return (this.pendingJobsCount > 0);
        }

        execute() {
            //console.log(`DEBUG --- Execute all`);
            this.assertJobDependenciesConsistency();

            return new Promise((resolve, reject) => {
                var executeNext = () => {
                    //console.log(`DEBUG --- Execute next`);
                    var executableJobs = this.findExecutableJobs();

                    if (0 === executableJobs.length) {
                        if (this.hasPendingJobs()) {
                            return;
                        }
                        if (!this.areAllJobsExecuted()) {
                            reject(new Error('There are still some not executed jobs'));

                            return;
                        }
                        resolve();

                        return;
                    }

                    executableJobs.forEach((executableJob) => {
                        var executableJobPromise = this.jobExecutorCollection
                            .getSupporting(executableJob)
                            .execute(executableJob);

                        this.increasePendingJobsCount();
                        this.jobToPromiseMap.set(executableJob, executableJobPromise);

                        executableJobPromise.finally(() => {
                            this.decreasePendingJobsCount();
                            process.nextTick(executeNext);
                        });
                    });
                };

                process.nextTick(executeNext);
            });
        }
    }

    return {
        JobExecutorCollection,
        DependantJobsExecutor
    };

};
