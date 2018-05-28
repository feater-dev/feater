import * as path from 'path';
import * as fs from 'fs-extra';
import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {JobInterface, SourceJobInterface} from './job';
import {JobExecutorInterface} from './job-executor';

export class CopyBeforeBuildTaskJob implements SourceJobInterface {

    constructor(
        readonly source: any,
        readonly sourceRelativePath: string,
        readonly destinationRelativePath: string,
    ) {}

}

@Component()
export class CopyBeforeBuildTaskJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof CopyBeforeBuildTaskJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const sourceJob = job as CopyBeforeBuildTaskJob;
        const logger = this.jobLoggerFactory.createForSourceJob(sourceJob);
        const { source, sourceRelativePath, destinationRelativePath } = sourceJob;

        return new Promise(resolve => {
            logger.info(`Copying ${sourceRelativePath} to ${destinationRelativePath}.`);
            fs.copySync(
                path.join(source.fullBuildPath, sourceRelativePath),
                path.join(source.fullBuildPath, destinationRelativePath),
            );

            resolve();
        });
    }

}
