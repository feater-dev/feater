import * as path from 'path';
import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {InterpolationHelper} from '../interpolation-helper.component';
import {JobInterface, SourceJobInterface} from './job';
import {JobExecutorInterface} from './job-executor';

export class InterpolateBeforeBuildTaskJob implements SourceJobInterface {

    constructor(
        readonly source: any,
        readonly relativePath: string,
    ) {}

}

@Component()
export class InterpolateBeforeBuildTaskJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly interpolationHelper: InterpolationHelper,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof InterpolateBeforeBuildTaskJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const sourceJob = job as InterpolateBeforeBuildTaskJob;
        const logger = this.jobLoggerFactory.createForSourceJob(sourceJob);
        const { source } = sourceJob;

        return new Promise(resolve => {
            logger.info(`Interpolating Feat variables in ${sourceJob.relativePath}.`);

            const fullPath = path.join(source.fullBuildPath, sourceJob.relativePath);

            this.interpolationHelper.interpolateFile(fullPath, source.build);

            resolve();
        });
    }
}
