import * as _ from 'lodash';
import {Component} from '@nestjs/common';
import {JobInterface} from './job/job';
import {JobExecutorsCollection} from './job-executors-collection.component';

class Stage {

    constructor(
        readonly id: string,
        readonly precedingStageIdPrefixes: string[],
        readonly job: JobInterface,
    ) {}

}

class StagesList {

    private stages: Stage[];

    constructor(
        private readonly jobExecutorsCollection: JobExecutorsCollection,
    ) {
        this.stages = [];
    }

    addParallelStage(
        id: string,
        precedingStageIdPrefixes: string[],
        jobs: JobInterface[],
    ) {
        let index = 0;
        for (const job of jobs) {
            const jobId = `${id}_${index}`;
            this.stages.push({
                id: jobId,
                precedingStageIdPrefixes: precedingStageIdPrefixes.slice(),
                job,
            });
            index += 1;
        }
    }

    addSequentialStage(
        id: string,
        precedingStageIdPrefixes: string[],
        jobs: JobInterface[],
    ) {
        let index = 0;
        const extendedPrecedingStageIdPrefixes = precedingStageIdPrefixes.slice();
        for (const job of jobs) {
            const jobId = `${id}_${index}`;
            this.stages.push({
                id: jobId,
                precedingStageIdPrefixes: extendedPrecedingStageIdPrefixes.slice(),
                job,
            });
            index += 1;
            extendedPrecedingStageIdPrefixes.push(jobId);
        }
    }

    execute(): Promise<any> {
        const resolutionsMap = {};
        const runningStageFlags = {};

        const notResolvedStageFlags = {};
        for (const stage of this.stages) {
            notResolvedStageFlags[stage.id] = true;
        }

        return new Promise((resolve, reject) => {

            const tick = () => {
                if (_.isEmpty(notResolvedStageFlags)) {
                    resolve(resolutionsMap);

                    return;
                }

                let noStageRunThisTick = true;
                _.each(
                    this.stages,
                    stage => {
                        const { id, precedingStageIdPrefixes, job } = stage;

                        if (!notResolvedStageFlags[id]) {
                            return;
                        }

                        for (const precedingStageIdPrefix of precedingStageIdPrefixes) {
                            for (const notResolvedStageId of Object.keys(notResolvedStageFlags)) {
                                if (this.isIdPrefixMatching(notResolvedStageId, precedingStageIdPrefix)) {
                                    // Not able to run job, some required job is not resolved yet.

                                    return;
                                }
                            }
                        }

                        noStageRunThisTick = false;
                        runningStageFlags[id] = true;

                        this.jobExecutorsCollection
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
                                },
                            );
                    },
                );

                if (noStageRunThisTick && _.isEmpty(runningStageFlags)) {
                    reject(new Error('Inconsistent job dependencies.'));
                }
            };

            setTimeout(tick, 0);
        });
    }

    isIdPrefixMatching(id: string, idPrefix: string): boolean {
        return (
            id.length >= idPrefix.length
            && id.substr(0, idPrefix.length) === idPrefix
        );
    }

}

@Component()
export class StagesListFactory {

    constructor(
        private readonly jobExecutorCollection: JobExecutorsCollection,
    ) {}

    create() {
        return new StagesList(this.jobExecutorCollection);
    }

}
