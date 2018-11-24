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

@Injectable()
export class CloneSourceCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    readonly PROGRESS_THROTTLE_PERIOD = 200;

    constructor(
        private readonly deployKeyRepository: DeployKeyRepository,
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
            logger.info(`Using deploy key} to clone over SSH.`);
            deployKey = await this.deployKeyRepository.findOneByCloneUrl(typedCommand.cloneUrl);
            logger.info(`Deploy key fingerprint: ${sshFingerprint(deployKey.publicKey)}`);
        } else {
            deployKey = null;
            logger.info(`Not using deploy key.`);
        }
        const repository = await nodegit.Clone.clone(
            typedCommand.cloneUrl,
            typedCommand.absoluteGuestInstanceDirPath,
            this.createCloneOptions(typedCommand.commandLogger, deployKey),
        );
        logger.info(`Cloning completed.`);

        await this.checkoutReference(typedCommand, repository);

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

    protected async checkoutReference(command: CloneSourceCommand, repo: nodegit.Repository): Promise<void> {
        if ('branch' === command.referenceType) {
            const reference = await repo.getBranch(`refs/remotes/origin/${command.referenceName}`);
            await repo.checkoutRef(reference);
            command.commandLogger.info(`Checked out branch: ${command.referenceName}`);

            return;
        }

        if ('tag' === command.referenceType) {
            const reference = await repo.getReference(`refs/tags/${command.referenceName}`);
            await repo.checkoutRef(reference);
            command.commandLogger.info(`Checked out tag: ${command.referenceName}`);
        }

        if ('commit' === command.referenceType) {
            const commit = await repo.getCommit(command.referenceName);
            await repo.setHeadDetached(commit.id());
            command.commandLogger.info(`Checked out commit: ${command.referenceName}`);
        }
    }
}
