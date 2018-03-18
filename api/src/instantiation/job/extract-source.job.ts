import * as decompress from 'decompress';
import { Component } from '@nestjs/common';
import { JobInterface, SourceJobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

export class ExtractSourceJob implements SourceJobInterface {

    constructor(
        readonly source: any,
    ) {}

}

@Component()
export class ExtractSourceJobExecutor implements JobExecutorInterface {

    supports(job: JobInterface): boolean {
        return (job instanceof ExtractSourceJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const sourceJob = job as ExtractSourceJob;
        const { source } = sourceJob;

        return new Promise((resolve, reject) => {
            console.log('Extracting source.');

            source.relativePath = source.id;
            decompress(source.zipFileFullPath, source.fullBuildPath, { strip: 1 })
                .then(resolve)
                .catch(error => {
                    console.log('Failed to extract source.');
                    reject(error);
                });
        });
    }
}
