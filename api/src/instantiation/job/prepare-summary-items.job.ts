import * as _ from 'lodash';
import { Component } from '@nestjs/common';
import { BuildInstanceRepository } from '../../persistence/build-instance.repository';
import { InterpolationHelper } from '../interpolation-helper.component';
import { BuildJobInterface, JobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

export class PrepareSummaryItemsJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class PrepareSummaryItemsJobExecutor implements JobExecutorInterface{

    constructor(
        private readonly buildInstanceRepository: BuildInstanceRepository,
        private readonly interpolationHelper: InterpolationHelper,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof PrepareSummaryItemsJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as PrepareSummaryItemsJob;
        const { build } = buildJob;

        return new Promise(resolve => {
            console.log(`Setting summary items.`);

            _.each(
                build.config.summaryItems,
                summaryItem => {
                    build.summaryItems.add(
                        summaryItem.name,
                        this.interpolationHelper.interpolateText(summaryItem.value, build),
                    );
                },
            );

            this.buildInstanceRepository
                .updateSummaryItems(build)
                .then(resolve);
        });
    }
}
