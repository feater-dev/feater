import * as path from 'path';
import * as fs from 'fs';
import { mkdirSync } from 'mkdir-recursive';
import { exec } from 'child_process';
import { Component } from '@nestjs/common';
import { Config } from '../../config/config.component';
import { JobLoggerFactory } from '../../logger/job-logger-factory';
import { JobInterface, SourceJobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

const BUFFER_SIZE = 268435456; // 256M

export class DownloadSourceJob implements SourceJobInterface {

    constructor(
        readonly source: any,
    ) {}

}

@Component()
export class DownloadSourceJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly config: Config,
        private readonly jobLoggerFactory: JobLoggerFactory,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof DownloadSourceJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const sourceJob = job as DownloadSourceJob;
        const logger = this.jobLoggerFactory.createForSourceJob(sourceJob);
        const { source } = sourceJob;

        return new Promise((resolve, reject) => {
            const { repository, commit } = source.resolvedReference;
            const { sha } = commit.data;
            const [ owner, name ] = repository.split('/');
            const zipFileDirPath = path.join(this.config.guestPaths.repositoryCache, 'github', owner, name);

            if (!fs.existsSync(zipFileDirPath)) {
                mkdirSync(zipFileDirPath);
            }

            source.zipFileUrl = `https://api.github.com/repos/${repository}/zipball/${sha}`;
            source.zipFileFullPath = path.join(zipFileDirPath, `${sha}.zip`);

            // Check if given source is already cached.
            // If so no need to download, just resolve this job.
            if (fs.existsSync(source.zipFileFullPath)) {
                // TODO Improve loggers.
                logger.info(
                    'Source already cached.',
                    {
                        zipFileUrl: source.zipFileUrl,
                        zipFileFullPath: source.zipFileFullPath,
                    },
                );
                resolve();

                return;
            }

            // Otherwise download source and keep it in cache.
            logger.info('Downloading source.');
            exec(
                `curl -s -H "Authorization: token ${this.config.github.personalAccessToken}" -L ${source.zipFileUrl} > ${source.zipFileFullPath}`,
                { maxBuffer: BUFFER_SIZE },
                error => {
                    if (error) {
                        logger.info(`Failed to download source from GitHub repository ${repository} at commit ${commit.sha}.`);
                        reject(error);

                        return;
                    }
                    resolve();
                },
            );
        });
    }

}
