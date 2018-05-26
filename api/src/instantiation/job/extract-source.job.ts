import * as _ from 'lodash';
import * as decompress from 'decompress';
import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {JobInterface, SourceJobInterface} from './job';
import {JobExecutorInterface} from './job-executor';

export class ExtractSourceJob implements SourceJobInterface {

    constructor(
        readonly source: any,
    ) {}

}

@Component()
export class ExtractSourceJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof ExtractSourceJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const sourceJob = job as ExtractSourceJob;
        const logger = this.jobLoggerFactory.createForSourceJob(sourceJob);
        const { source } = sourceJob;

        return new Promise((resolve, reject) => {
            logger.info('Extracting source.');

            source.relativePath = source.id;
            decompress(source.zipFileFullPath, source.fullBuildPath, { strip: 1 })
                .then(resolve)
                .catch(error => {
                    logger.error('Failed to extract source.', {error: _.toString(error)});
                    reject(error);
                });
        });
    }

}
