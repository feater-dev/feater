var _ = require('underscore');

module.exports = function () {

    class JobsList {

        constructor() {
            this.stages = [];
        }

        addParallelStage(id, precedingStageIdPrefixes, jobs) {
            let index = 0;
            let jobId;
            for (let job of jobs) {
                jobId = `${id}_${index}`;
                this.stages.push({
                    id: jobId,
                    precedingStageIdPrefixes: extendedPrecedingStageIdPrefixes.slice(),
                    job
                });
                index += 1;
            }
        }

        addSequentialStage(id, precedingStageIdPrefixes, jobs) {
            let index = 0;
            let jobId;
            let extendedPrecedingStageIdPrefixes = precedingStageIdPrefixes.slice();
            for (let job of jobs) {
                jobId = `${id}_${index}`;
                this.stages.push({
                    id: jobId,
                    precedingStageIdPrefixes: extendedPrecedingStageIdPrefixes.slice(),
                    job
                });
                index += 1;
                extendedPrecedingStageIdPrefixes.push(jobId);
            }
        }

        run(jobExecutorsCollection) {
            let resolutionsMap = {};
            let runningStageFlags = {};

            let notResolvedStageFlags = {};
            for (let stage of this.stages) {
                notResolvedStageFlags[stage.id] = true;
            }

            function isIdPrefixMatching(id, idPrefix) {
                return (
                    id.length >= idPrefix.length
                    && id.substr(0, idPrefix.length) === idPrefix
                );
            }

            return new Promise((resolve, reject) => {

                let tick = () => {
                    if (_.isEmpty(notResolvedStageFlags)) {
                        resolve(resolutionsMap);

                        return;
                    }

                    let noStageRunThisTick = true;
                    _.each(
                        this.stages,
                        stage => {
                            let {id, precedingStageIdPrefixes, job} = stage;

                            if (!notResolvedStageFlags[id]) {
                                return;
                            }

                            for (let precedingStageIdPrefix of precedingStageIdPrefixes) {
                                for (let notResolvedStageId in notResolvedStageFlags) {
                                    if (isIdPrefixMatching(notResolvedStageId, precedingStageIdPrefix)) {
                                        // Not able to run job, some required job is not resolved yet.

                                        return;
                                    }
                                }
                            }

                            noStageRunThisTick = false;
                            runningStageFlags[id] = true;

                            jobExecutorsCollection
                                .getSupporting(job)
                                .execute(job, resolutionsMap)
                                .then(
                                    resolution => {
                                        resolutionsMap[id] = resolution;
                                        delete runningStageFlags[id];
                                        delete notResolvedStageFlags[id];
                                        setTimeout(tick, 0);
                                    },
                                    error => {
                                        reject(error);
                                    }
                                );
                        }
                    );

                    if (noStageRunThisTick && _.isEmpty(runningStageFlags)) {
                        reject(new Error('Inconsistent job dependencies.'));
                    }
                };

                setTimeout(tick, 0);
            });
        }
    }

    return JobsList;

};
