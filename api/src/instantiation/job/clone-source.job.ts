import * as nodegit from 'nodegit';
import {mkdirSync} from 'mkdir-recursive';
import {Component} from '@nestjs/common';
import {Config} from '../../config/config.component';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {JobInterface, SourceJobInterface} from './job';
import {JobExecutorInterface} from './job-executor';

const PROGRESS_THROTTLE_PERIOD = 10; // In miliseconds.

export class CloneSourceJob implements SourceJobInterface {

    constructor(
        readonly source: any,
    ) {}

}

@Component()
export class CloneSourceJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly config: Config,
        private readonly jobLoggerFactory: JobLoggerFactory,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof CloneSourceJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const sourceJob = job as CloneSourceJob;
        const logger = this.jobLoggerFactory.createForSourceJob(sourceJob);
        const {source} = sourceJob;

        source.relativePath = source.id;

        logger.info(`Cloning source from ${source.config.sshCloneUrl} to ${source.fullBuildPath}.`);

        return new Promise((resolve, reject) => {
            const cloneOpts = {
                fetchOpts: {
                    callbacks: {
                        credentials: (repoUrl, userName) => nodegit.Cred.sshKeyNew(
                            userName,
                            this.config.sshKey.publicKeyPath,
                            this.config.sshKey.privateKeyPath,
                            this.config.sshKey.passphrase,
                        ),
                        transferProgress: {
                            throttle: PROGRESS_THROTTLE_PERIOD,
                            callback: (transferProgress) => {
                                const progress = 100 * (
                                    (transferProgress.receivedObjects() + transferProgress.indexedObjects()) /
                                    (transferProgress.totalObjects() * 2)
                                );
                                logger.info(`Cloning progress ${progress.toFixed(2)}%.`);
                            },
                        },
                    },
                },
            };

            nodegit
                .Clone(source.config.sshCloneUrl, source.fullBuildPath, cloneOpts)
                .then(repo => {
                    // TODO Handle non-existent reference and improve logging and error reporting.
                    switch (source.config.reference.type) {
                        case 'branch':
                            return repo
                                .getBranch(`refs/remotes/origin/${source.config.reference.name}`)
                                .then(reference => {
                                    return repo.checkoutRef(reference);
                                });

                        case 'tag': // TODO Allow to checkout tag.
                        case 'commit': // TODO Allow to checkout commit.
                        default:
                            reject();
                    }
                })
                .then(() => {
                    logger.info(`Completed cloning source from ${source.config.sshCloneUrl}.`);
                    resolve();
                })
                .catch(err => {
                    logger.info(`Failed to clone source from ${source.config.sshCloneUrl}.`);
                    reject(err);
                });
        });
    }
}
