import * as sshFingerprint from 'ssh-fingerprint';
import {mkdirSync} from 'fs';
import {spawnSync, spawn, SpawnOptions} from 'child_process';
import {Injectable} from '@nestjs/common';
import {config} from '../../../config/config';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {DeployKeyRepository} from '../../../persistence/repository/deploy-key.repository';
import {CloneSourceCommand} from './command';
import {SimpleCommand} from '../../executor/simple-command';
import {CommandLogger} from '../../logger/command-logger';
import {SpawnHelper} from '../../helper/spawn-helper.component';
import {DeployKeyHelperComponent} from '../../../helper/deploy-key-helper.component';

@Injectable()
export class CloneSourceCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly deployKeyRepository: DeployKeyRepository,
        private readonly deployKeyHelper: DeployKeyHelperComponent,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof CloneSourceCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            cloneUrl,
            useDeployKey,
            referenceType,
            referenceName,
            sourceAbsoluteGuestPath,
            workingDirectory,
            commandLogger,
        } = command as CloneSourceCommand;

        commandLogger.info(`Creating directory.`);
        mkdirSync(sourceAbsoluteGuestPath);

        commandLogger.info(`Cloning repository.`);
        await this.cloneRepository(cloneUrl, useDeployKey, sourceAbsoluteGuestPath, workingDirectory, commandLogger);

        commandLogger.info(`Checking out reference.`);
        this.checkoutReference(referenceType, referenceName, sourceAbsoluteGuestPath, commandLogger);

        return {};
    }

    protected async cloneRepository(
        cloneUrl: string,
        useDeployKey: boolean,
        sourceAbsoluteGuestPath: string,
        workingDirectory: string,
        commandLogger: CommandLogger,
    ): Promise<void> {
        let deployKey;
        const spawnedGitCloneOptions: SpawnOptions = {cwd: workingDirectory};

        commandLogger.info(`Clone URL: ${cloneUrl}`);
        if (useDeployKey) {
            commandLogger.info(`Using deploy key to clone.`);
            deployKey = await this.deployKeyRepository.findOneByCloneUrl(cloneUrl);
            commandLogger.info(`Deploy key fingerprint: ${sshFingerprint(deployKey.publicKey)}`);

            const identityFileAbsoluteGuestPath = this.deployKeyHelper.getIdentityFileAbsoluteGuestPath(cloneUrl);

            spawnedGitCloneOptions.env = {
                GIT_SSH_COMMAND: [
                    `sshpass`, `-e`, `-P`, `"Enter passphrase for key '${identityFileAbsoluteGuestPath}': "`,
                    `ssh`, `-o`, `StrictHostKeyChecking=no`, `-i`, identityFileAbsoluteGuestPath,
                ].join(' '),
                SSHPASS: deployKey.passphrase,
            };
        } else {
            deployKey = null;
            commandLogger.info(`Not using deploy key.`);
        }

        const spawnedGitClone = spawn(
            config.instantiation.gitBinaryPath,
            ['clone', '--quiet', cloneUrl, sourceAbsoluteGuestPath],
            spawnedGitCloneOptions,
        );

        // TODO Show informative messages on error.
        await this.spawnHelper.promisifySpawnedWithHeader(
            spawnedGitClone,
            commandLogger,
            'clone source',
            {
                muteStdout: true,
                muteStderr: true,
            }
        );
    }

    protected checkoutReference(
        referenceType: string,
        referenceName: string,
        sourceAbsoluteGuestPath: string,
        commandLogger: CommandLogger
    ): void {
        let commitHash: string;
        let fullReference: string;
        let matchedCommitHash: string;

        if ('branch' === referenceType) {
            commandLogger.info(`Finding branch ${referenceName}.`);
            const showReferencesOutput = spawnSync(
                    config.instantiation.gitBinaryPath,
                    ['show-ref'],
                    {cwd: sourceAbsoluteGuestPath},
                )
                .stdout
                .toString()
                .replace(/\n$/, '')
                .split('\n');

            for (const showReferenceOutput of showReferencesOutput) {
                [commitHash, fullReference] = showReferenceOutput.split(' ');
                if (`refs/remotes/origin/${referenceName}` === fullReference) {
                    matchedCommitHash = commitHash;
                    break;
                }
            }
        }

        else if ('tag' === referenceType) {
            commandLogger.info(`Finding tag ${referenceName}.`);
            const showReferencesOutput = spawnSync(
                    config.instantiation.gitBinaryPath,
                    ['show-ref', '--tags'],
                    {cwd: sourceAbsoluteGuestPath},
                )
                .stdout
                .toString()
                .replace(/\n$/, '')
                .split('\n');

            for (const showReferenceOutput of showReferencesOutput) {
                [commitHash, fullReference] = showReferenceOutput.split(' ');
                if (`refs/tags/${referenceName}` === fullReference) {
                    matchedCommitHash = commitHash;
                    break;
                }
            }
        }

        else if ('commit' === referenceType) {
            commandLogger.info(`Finding commit ${referenceName}.`);
            matchedCommitHash = referenceName;
        }

        else {
            throw new Error(`Unknown reference type ${referenceType}.`);
        }

        if (!matchedCommitHash) {
            throw new Error('Failed to find reference.');
        }

        const gitLogLines = spawnSync(
                config.instantiation.gitBinaryPath,
                ['log', '--oneline', '-1',  '--no-decorate', '--no-color', matchedCommitHash],
                {cwd: sourceAbsoluteGuestPath},
            )
            .stdout
            .toString()
            .replace(/\n$/, '')
            .split('\n');

        if (!gitLogLines.length) {
            throw new Error(`Failed to find commit ${matchedCommitHash}.`);
        }

        if (gitLogLines.length > 1) {
            throw new Error(`Multiple commits matched ${matchedCommitHash}.`);
        }

        const gitLogLineSeparatorIndex = gitLogLines[0].indexOf(' ');
        const matchedCommitShortHash = gitLogLines[0].substr(0, gitLogLineSeparatorIndex);
        const matchedCommitMessage = gitLogLines[0].substr(gitLogLineSeparatorIndex + 1);

        commandLogger.info(`Checking out commit ${matchedCommitShortHash} with message '${matchedCommitMessage}'`);

        spawnSync(
            config.instantiation.gitBinaryPath,
            ['checkout', matchedCommitShortHash],
            {cwd: sourceAbsoluteGuestPath},
        );
    }

}
