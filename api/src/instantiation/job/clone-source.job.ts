import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {JobInterface, SourceJobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {DeployKeyRepository} from '../../persistence/repository/deploy-key.repository';
import * as nodegit from 'nodegit';

const PROGRESS_THROTTLE_PERIOD = 10; // In miliseconds.

export class CloneSourceJob implements SourceJobInterface {

    constructor(
        readonly source: any,
    ) {}

}

@Component()
export class CloneSourceJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly deployKeyRepository: DeployKeyRepository,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof CloneSourceJob);
    }

    async execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const sourceJob = job as CloneSourceJob;
        const logger = this.jobLoggerFactory.createForSourceJob(sourceJob);
        const {source} = sourceJob;
        const sshCloneUrl = source.config.sshCloneUrl;
        source.relativePath = source.id; // TODO Required to obtain fullBuildPath, needs to be improved.

        logger.info(`Cloning source from ${sshCloneUrl} to ${source.fullBuildPath}.`);

        const deployKey = await this.deployKeyRepository.findBySshCloneUrl(sshCloneUrl);

        const cloneOpts = {
            fetchOpts: {
                callbacks: {
                    credentials: (repoUrl, userName) => nodegit.Cred.sshKeyMemoryNew(
                        userName,
                        deployKey.publicKey,
                        deployKey.privateKey,
                        deployKey.passphrase,
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

        const repo = await nodegit.Clone(sshCloneUrl, source.fullBuildPath, cloneOpts);

        switch (source.config.reference.type) {
            case 'branch':
                const reference = await repo.getBranch(`refs/remotes/origin/${source.config.reference.name}`);
                await repo.checkoutRef(reference);
                break;

            case 'tag': // TODO Allow to checkout tag.
            case 'commit': // TODO Allow to checkout commit.
            default:
                throw new Error();
        }

        logger.info(`Completed cloning source from ${sshCloneUrl}.`);
    }
}
