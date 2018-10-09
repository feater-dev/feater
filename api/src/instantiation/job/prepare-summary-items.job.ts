import * as _ from 'lodash';
import {Injectable} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {InstanceRepository} from '../../persistence/repository/instance.repository';
import {InterpolationHelper} from '../interpolation-helper.component';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';

export class PrepareSummaryItemsJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Injectable()
export class PrepareSummaryItemsJobExecutor implements JobExecutorInterface{

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly instanceRepository: InstanceRepository,
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
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);
        const { build } = buildJob;

        return new Promise(resolve => {
            logger.info(`Setting summary items.`);

            _.each(
                build.config.summaryItems,
                summaryItem => {
                    build.summaryItems.add(
                        summaryItem.name,
                        this.interpolationHelper.interpolateText(summaryItem.text, build),
                    );
                },
            );

            this.instanceRepository
                .updateSummaryItems(build)
                .then(resolve);
        });
    }
}
