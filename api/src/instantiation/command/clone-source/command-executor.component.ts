import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {DeployKeyRepository} from '../../../persistence/repository/deploy-key.repository';
import {CloneSourceCommand} from './command';
import {DeployKeyInterface} from '../../../persistence/interface/deploy-key.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {BaseLogger} from '../../../logger/base-logger';
import * as nodegit from 'nodegit';
import * as gitUrlParse from 'git-url-parse';
import * as sshFingerprint from 'ssh-fingerprint';
import {CommandLogger} from '../../logger/command-logger';
import {spawn} from 'child_process';
import {environment} from '../../../environments/environment';
import {SpawnHelper} from '../../helper/spawn-helper.component';

@Injectable()
export class CloneSourceCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    readonly PROGRESS_THROTTLE_PERIOD = 200;

    constructor(
        private readonly deployKeyRepository: DeployKeyRepository,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof CloneSourceCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = (command as CloneSourceCommand);
        const logger = typedCommand.commandLogger;

        let deployKey;

        logger.info(`Clone URL: ${typedCommand.cloneUrl}`);
        if ('ssh' === gitUrlParse(typedCommand.cloneUrl).protocol) {
            logger.info(`Using deploy key to clone over SSH.`);
            deployKey = await this.deployKeyRepository.findOneByCloneUrl(typedCommand.cloneUrl);
            logger.info(`Deploy key fingerprint: ${sshFingerprint(deployKey.publicKey)}`);
        } else {
            deployKey = null;
            logger.info(`Not using deploy key.`);
        }
        const repository = await nodegit.Clone.clone(
            typedCommand.cloneUrl,
            typedCommand.absoluteGuestSourceDirPath,
            this.createCloneOptions(typedCommand.commandLogger, deployKey),
        );
        logger.info(`Cloning completed.`);

        await this.checkoutReference(
            typedCommand.referenceType,
            typedCommand.referenceName,
            repository,
            logger,
        );

        await this.copySourceToVolume(
            typedCommand.absoluteHostSourceDirPath,
            typedCommand.volumeName,
            typedCommand.absoluteGuestSourceDirPath,
            logger,
        );

        return {};
    }

    protected createCloneOptions(commandLogger: CommandLogger, deployKey?: DeployKeyInterface): any {
        const logger = new BaseLogger(); // TODO Replace with real logger.
        let lastProgress: string;

        const callbacks: any = {};

        callbacks.transferProgress = {
            throttle: this.PROGRESS_THROTTLE_PERIOD,
                callback: (transferProgress) => {
                const progress = (100 * (
                    (transferProgress.receivedObjects() + transferProgress.indexedObjects()) /
                    (transferProgress.totalObjects() * 2)
                )).toFixed(2);

                if (progress !== lastProgress) {
                    lastProgress = progress;
                    commandLogger.info(`Cloning progress ${progress}%.`);
                }
            },
        };

        if (deployKey) {
            callbacks.credentials = (repoUrl, username) => nodegit.Cred.sshKeyMemoryNew(
                username,
                deployKey.publicKey,
                deployKey.privateKey,
                deployKey.passphrase,
            );
        }

        return {
            fetchOpts: {
                callbacks,
            },
        };
    }

    protected async checkoutReference(
        referenceType: string,
        referenceName: string,
        repo: nodegit.Repository,
        logger: CommandLogger,
    ): Promise<void> {
        if ('branch' === referenceType) {
            const reference = await repo.getBranch(`refs/remotes/origin/${referenceName}`);
            await repo.checkoutRef(reference);
            logger.info(`Checked out branch: ${referenceName}`);

            return;
        }

        if ('tag' === referenceType) {
            const reference = await repo.getReference(`refs/tags/${referenceName}`);
            await repo.checkoutRef(reference);
            logger.info(`Checked out tag: ${referenceName}`);
        }

        if ('commit' === referenceType) {
            const commit = await repo.getCommit(referenceName);
            await repo.setHeadDetached(commit.id());
            logger.info(`Checked out commit: ${referenceName}`);
        }
    }

    protected copySourceToVolume(
        absoluteHostInstanceDirPath: string,
        volumeName: string,
        workingDirectory: string,
        logger: CommandLogger,
    ): Promise<void> {
        // TODO Run this after before build tasks are executed.

        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                [
                    'run', '--rm',
                    '-v', `${absoluteHostInstanceDirPath}:/source`,
                    '-v', `${volumeName}:/target`,
                    'alpine', 'ash', '-c', 'cp -rT /source /target',
                ],
                {cwd: workingDirectory},
            );

            this.spawnHelper.handleSpawned(
                spawned,
                logger,
                resolve,
                reject,
                () => {
                    logger.info(`Completed copying source to volume.`, {});
                },
                (exitCode: number) => {
                    logger.error(`Failed to copy source to volume.`, {});
                    logger.error(`Exit code: ${exitCode}`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to copy source to volume.`, {});
                    logger.error(`Error message: ${error.message}`, {});
                },
            );
        });
    }
}
