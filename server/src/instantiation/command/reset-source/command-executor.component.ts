import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { DeployKeyRepository } from '../../../persistence/repository/deploy-key.repository';
import { ResetSourceCommand } from './command';
import { DeployKeyInterface } from '../../../persistence/interface/deploy-key.interface';
import { SimpleCommand } from '../../executor/simple-command';
import { CommandLogger } from '../../logger/command-logger';
import * as gitUrlParse from 'git-url-parse';
import * as sshFingerprint from 'ssh-fingerprint';
import { Checkout, Commit, FetchOptions, Repository, Reset } from 'nodegit';
import * as nodegit from 'nodegit';

// TODO Forward port.
// TODO Don't rely on `nodegit`.
// TODO Adjust to the new way of storing deploy keys.

@Injectable()
export class ResetSourceCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    constructor(private readonly deployKeyRepository: DeployKeyRepository) {}

    supports(command: SimpleCommand): boolean {
        return command instanceof ResetSourceCommand;
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            cloneUrl,
            referenceType,
            referenceName,
            sourceAbsoluteGuestPath,
            commandLogger,
        } = command as ResetSourceCommand;

        if ('commit' === referenceType) {
            commandLogger.info(`Skipping reset as reference type is commit.`);

            return {};
        }

        commandLogger.info(`Finding deploy key.`);
        const deployKey = await this.findDeployKey(cloneUrl, commandLogger);

        commandLogger.info(`Opening repository.`);
        const repository = await Repository.open(sourceAbsoluteGuestPath);

        commandLogger.info(`Fetching remote.`);
        await repository.fetch('origin', this.createFetchOptions(deployKey));

        commandLogger.info(`Getting reference commit from remote branch.`);
        const commit = await this.getReferenceCommit(
            referenceType,
            referenceName,
            repository,
            commandLogger,
        );

        commandLogger.info(`Resetting repository.`);
        await Reset.reset(
            repository,
            // @ts-ignore: Argument of type 'Commit' is not assignable to parameter of type 'Object'.
            commit,
            Reset.TYPE.HARD,
            { checkoutStrategy: Checkout.STRATEGY.FORCE }, // TODO Is this checkout option needed?
        );
        commandLogger.info(`Reset completed.`);

        return {};
    }

    private async findDeployKey(
        cloneUrl: string,
        logger: CommandLogger,
    ): Promise<DeployKeyInterface | null> {
        logger.info(`Clone URL: ${cloneUrl}`);

        if ('ssh' !== gitUrlParse(cloneUrl).protocol) {
            logger.info(`Not using deploy key.`);

            return null;
        }

        logger.info(`Using deploy key to clone over SSH.`);
        const deployKey = await this.deployKeyRepository.findOneByCloneUrl(
            cloneUrl,
        );
        logger.info(
            `Deploy key fingerprint: ${sshFingerprint(deployKey.publicKey)}`,
        );

        return deployKey;
    }

    private createFetchOptions(deployKey?: DeployKeyInterface): FetchOptions {
        const fetchOptions: FetchOptions = {
            callbacks: {},
        };

        if (deployKey) {
            fetchOptions.callbacks.credentials = (repoUrl, username) =>
                nodegit.Cred.sshKeyMemoryNew(
                    username,
                    deployKey.publicKey,
                    deployKey.privateKey,
                    deployKey.passphrase,
                );
        }

        return fetchOptions;
    }

    private async getReferenceCommit(
        referenceType: string,
        referenceName: string,
        repo: nodegit.Repository,
        commandLogger: CommandLogger,
    ): Promise<Commit> {
        if ('branch' !== referenceType) {
            throw new Error(
                'Unsupported reference type, only branches are supported.',
            );
        }

        const commit = await repo.getReferenceCommit(
            `refs/remotes/origin/${referenceName}`,
        );
        commandLogger.info(`Referenced branch: ${referenceName}`);
        commandLogger.info(`Commit hash: ${commit.sha()}`);

        return commit;
    }
}
