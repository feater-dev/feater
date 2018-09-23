import * as path from 'path';
import * as fs from 'fs-extra';
import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {environment} from '../../environment/environment';

export class CreateDirectoryJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class CreateDirectoryJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof CreateDirectoryJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw  new Error();
        }

        const buildJob = job as CreateDirectoryJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);
        const { build } = buildJob;

        return new Promise(resolve => {
            logger.info('Creating build directory.');

            build.fullBuildPath = path.join(environment.guestPaths.build, build.hash);
            build.fullBuildHostPath = path.join(environment.hostPaths.build, build.hash);

            fs.mkdirSync(build.fullBuildPath);

            resolve();
        });
    }

}
