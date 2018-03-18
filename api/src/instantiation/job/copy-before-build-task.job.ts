import * as path from 'path';
import * as fs from 'fs-extra';
import { Component } from '@nestjs/common';
import { JobInterface, SourceJobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

export class CopyBeforeBuildTaskJob implements SourceJobInterface {

    constructor(
        readonly source: any,
        readonly sourceRelativePath: string,
        readonly destinationRelativePath: string,
    ) {}

}

@Component()
export class CopyBeforeBuildTaskJobExecutor implements JobExecutorInterface {

    supports(job: JobInterface): boolean {
        return (job instanceof CopyBeforeBuildTaskJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const sourceJob = job as CopyBeforeBuildTaskJob;
        const { source, sourceRelativePath, destinationRelativePath } = sourceJob;

        return new Promise(resolve => {
            console.log(`Copying ${sourceRelativePath} to ${destinationRelativePath}.`);
            fs.copySync(
                path.join(source.fullBuildPath, sourceRelativePath),
                path.join(source.fullBuildPath, destinationRelativePath),
            );

            resolve();
        });
    }

}
