import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { DeployKeyRepository } from '../../../persistence/repository/deploy-key.repository';
import { ResetSourceCommand } from './command';
import { DeployKeyInterface } from '../../../persistence/interface/deploy-key.interface';
import { SimpleCommand } from '../../executor/simple-command';
import { CommandLogger } from '../../logger/command-logger';
import * as sshFingerprint from 'ssh-fingerprint';
import { spawn, SpawnOptions, spawnSync } from 'child_process';
import { config } from '../../../config/config';
import { GitSshCommandEnvVariablesFactory } from '../git-ssh-command-env-variables-factory';
import { SpawnHelper } from '../../helper/spawn-helper.component';

@Injectable()
export class ResetSourceCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    constructor(
        private readonly deployKeyRepository: DeployKeyRepository,
        private readonly gitSshCommandEnvVariablesFactory: GitSshCommandEnvVariablesFactory,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return command instanceof ResetSourceCommand;
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            cloneUrl,
            useDeployKey,
            referenceType,
            referenceName,
            sourceAbsoluteGuestPath,
            commandLogger,
        } = command as ResetSourceCommand;

        if ('commit' === referenceType) {
            commandLogger.info(`Skipping reset as reference type is commit.`);

            return {};
        }

        commandLogger.info(`Fetching changes from remote repository.`);
        this.fetchRepository(
            cloneUrl,
            useDeployKey,
            sourceAbsoluteGuestPath,
            commandLogger,
        );

        commandLogger.info(`Getting reference commit from remote branch.`);
        const commitHash = await this.getReferenceCommitHash(
            referenceType,
            referenceName,
            sourceAbsoluteGuestPath,
            commandLogger,
        );

        commandLogger.info(`Resetting repository.`);
        await this.resetRepository(
            commitHash,
            sourceAbsoluteGuestPath,
            commandLogger,
        );

        return {};
    }

    private async fetchRepository(
        cloneUrl: string,
        useDeployKey: boolean,
        sourceAbsoluteGuestPath: string,
        commandLogger: CommandLogger,
    ): Promise<void> {
        const spawnedGitFetchOptions: SpawnOptions = {
            cwd: sourceAbsoluteGuestPath,
        };

        let deployKey: DeployKeyInterface | null;
        commandLogger.info(`Clone URL: ${cloneUrl}`);
        if (useDeployKey) {
            commandLogger.info(`Using deploy key to clone.`);
            deployKey = await this.deployKeyRepository.findOneByCloneUrl(
                cloneUrl,
            );
            commandLogger.info(
                `Deploy key fingerprint: ${sshFingerprint(
                    deployKey.publicKey,
                )}`,
            );
            spawnedGitFetchOptions.env = await this.gitSshCommandEnvVariablesFactory.create(
                deployKey,
            );
        } else {
            deployKey = null;
            commandLogger.info(`Not using deploy key.`);
        }

        const spawnedGitFetch = spawn(
            config.instantiation.gitBinaryPath,
            ['fetch', '--prune', '--prune-tags', '--tags', 'origin'],
            spawnedGitFetchOptions,
        );

        // TODO Show informative messages on error.
        await this.spawnHelper.promisifySpawnedWithHeader(
            spawnedGitFetch,
            commandLogger,
            'fetch source',
            {
                muteStdout: true,
                muteStderr: true,
            },
        );

        // TODO Handle when failed.
        // TODO Log something.
    }

    private getReferenceCommitHash(
        referenceType: string,
        referenceName: string,
        sourceAbsoluteGuestPath: string,
        commandLogger: CommandLogger,
    ): string {
        if ('branch' !== referenceType) {
            throw new Error(
                'Unsupported reference type, only branches are supported.',
            );
        }

        const spawnedGitRevParse = spawnSync(
            config.instantiation.gitBinaryPath,
            ['rev-parse', `refs/remotes/origin/${referenceName}`],
            { cwd: sourceAbsoluteGuestPath },
        );

        // TODO Handle when failed.
        // TODO Log something.

        return spawnedGitRevParse.output[0];
    }

    private resetRepository(
        commitHash: string,
        sourceAbsoluteGuestPath: string,
        commandLogger: CommandLogger,
    ): void {
        const spawnedGitReset = spawnSync(
            config.instantiation.gitBinaryPath,
            ['reset', '--hard', commitHash],
            { cwd: sourceAbsoluteGuestPath },
        );

        // TODO Handle when failed.
        // TODO Log something.
    }
}
