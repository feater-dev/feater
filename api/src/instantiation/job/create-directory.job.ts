import * as path from 'path';
import * as fs from 'fs-extra';
import { Component } from '@nestjs/common';
import { Config } from '../../config/config.component';
import { BuildJobInterface, JobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

export class CreateDirectoryJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class CreateDirectoryJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly config: Config,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof CreateDirectoryJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw  new Error();
        }

        const buildJob = job as CreateDirectoryJob;
        const { build } = buildJob;

        return new Promise(resolve => {
            console.log('Creating build directory.');

            build.fullBuildPath = path.join(this.config.guestPaths.build, build.hash);
            build.fullBuildHostPath = path.join(this.config.hostPaths.build, build.hash);

            fs.mkdirSync(build.fullBuildPath);

            resolve();
        });
    }

}
