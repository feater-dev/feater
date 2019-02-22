import * as gitUrlParse from 'git-url-parse';
import * as sshFingerprint from 'ssh-fingerprint';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {DeployKeyRepository} from '../../../persistence/repository/deploy-key.repository';
import {CloneSourceCommand} from './command';
import {DeployKeyInterface} from '../../../persistence/interface/deploy-key.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {CommandLogger} from '../../logger/command-logger';
import {EnvVariablesSet} from "../../sets/env-variables-set";
import {FeaterVariablesSet} from "../../sets/feater-variables-set";
import {CloneSourceCommandResultInterface} from "./command-result.interface";
import {spawnSync, spawn} from "child_process";
import {SpawnHelper} from "../../helper/spawn-helper.component";
import {mkdirSync} from "fs";

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
        const commandLogger = typedCommand.commandLogger;

        let deployKey;

        commandLogger.info(`Clone URL: ${typedCommand.cloneUrl}`);
        if ('ssh' === gitUrlParse(typedCommand.cloneUrl).protocol) {
            throw new Error('Not implemented.'); // TODO
            // commandLogger.info(`Using deploy key to clone over SSH.`);
            // deployKey = await this.deployKeyRepository.findOneByCloneUrl(typedCommand.cloneUrl);
            // commandLogger.info(`Deploy key fingerprint: ${sshFingerprint(deployKey.publicKey)}`);
        } else {
            deployKey = null;
            commandLogger.info(`Not using deploy key.`);
        }

        mkdirSync(typedCommand.sourceAbsoluteGuestPath);

        const spawnedGitClone = spawn(
            'git', // TODO
            ['clone', typedCommand.cloneUrl, typedCommand.sourceAbsoluteGuestPath],
            {cwd: typedCommand.workingDirectory}
        );

        await this.spawnHelper.promisifySpawnedWithHeader(
            spawnedGitClone,
            commandLogger,
            'clone source',
        );

        this.checkoutReference(
            typedCommand.referenceType,
            typedCommand.referenceName,
            typedCommand.sourceAbsoluteGuestPath,
            commandLogger
        );

        const dockerVolumeName = `${typedCommand.dockerComposeProjectName}_source_volume_${typedCommand.sourceId.toLowerCase()}`;
        commandLogger.info(`Volume name: ${dockerVolumeName}`);

        const envVariables = new EnvVariablesSet();
        const featerVariables = new FeaterVariablesSet();
        // TODO Depracted, remove later. Replaced volume name below.
        envVariables.add(
            `FEATER__HOST_SOURCE_PATH__${typedCommand.sourceId.toUpperCase()}`,
            typedCommand.sourceAbsoluteHostPath,
        );
        // TODO Depracted, remove later. Replaced volume name below.
        featerVariables.add(
            `host_source_path__${typedCommand.sourceId.toLowerCase()}`,
            typedCommand.sourceAbsoluteHostPath,
        );
        envVariables.add(
            `FEATER__SOURCE_VOLUME__${typedCommand.sourceId.toUpperCase()}`,
            dockerVolumeName,
        );
        featerVariables.add(
            `source_volume__${typedCommand.sourceId.toLowerCase()}`,
            dockerVolumeName,
        );

        commandLogger.infoWithEnvVariables(envVariables);
        commandLogger.infoWithFeaterVariables(featerVariables);

        return {
            dockerVolumeName,
            envVariables,
            featerVariables,
        } as CloneSourceCommandResultInterface;
    }

    // protected createCloneOptions(commandLogger: CommandLogger, deployKey?: DeployKeyInterface): any {
    //     let lastProgress: string;
    //
    //     const callbacks: any = {};
    //
    //     callbacks.transferProgress = {
    //         throttle: this.PROGRESS_THROTTLE_PERIOD,
    //             callback: (transferProgress) => {
    //             const progress = (100 * (
    //                 (transferProgress.receivedObjects() + transferProgress.indexedObjects()) /
    //                 (transferProgress.totalObjects() * 2)
    //             )).toFixed(2);
    //
    //             if (progress !== lastProgress) {
    //                 lastProgress = progress;
    //                 commandLogger.info(`Cloning progress ${progress}%.`);
    //             }
    //         },
    //     };
    //
    //     if (deployKey) {
    //         callbacks.credentials = (repoUrl, username) => nodegit.Cred.sshKeyMemoryNew(
    //             username,
    //             deployKey.publicKey,
    //             deployKey.privateKey,
    //             deployKey.passphrase,
    //         );
    //     }
    //
    //     return {
    //         fetchOpts: {
    //             callbacks,
    //         },
    //     };
    // }

    protected checkoutReference(
        referenceType: string,
        referenceName: string,
        sourceAbsoluteGuestPath: string,
        commandLogger: CommandLogger
    ): void {
        let commitHash: string;
        let fullReference: string;
        let matchedFullReference: string;
        let matchedCommitHash: string;

        if ('branch' === referenceType) {
            const showReferencesOutput = spawnSync(
                    'git', // TODO
                    ['show-ref', '--heads'],
                    {cwd: sourceAbsoluteGuestPath},
                )
                .stdout
                .toString()
                .replace(/\n$/, '')
                .split('\n');

            for (const showReferenceOutput of showReferencesOutput) {
                [commitHash, fullReference] = showReferenceOutput.split(' ');
                if (`refs/heads/${referenceName}` === fullReference) {
                    matchedFullReference = fullReference;
                    matchedCommitHash = commitHash;
                    break;
                }
            }
        }

        else if ('tag' === referenceType) {
            const showReferencesOutput = spawnSync(
                    'git', // TODO
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
                    matchedFullReference = fullReference;
                    matchedCommitHash = commitHash;
                    break;
                }
            }
        }

        else if ('commit' === referenceType) {
            matchedFullReference = matchedCommitHash = referenceName;
        }

        else {
            throw new Error(`Unknown reference type '${referenceType}'.`);
        }

        const gitLogLine = spawnSync(
                'git', // TODO
                ['log', '--oneline', '-1',  '--no-decorate', '--no-color', matchedCommitHash],
                {cwd: sourceAbsoluteGuestPath},
            )
            .stdout
            .toString()
            .replace(/\n$/, '')
            .split('\n')[0];
        commandLogger.info(gitLogLine);

        const gitLogLineSeparatorIndex = gitLogLine.indexOf(' ');
        const matchedCommitShortHash = gitLogLine.substr(0, gitLogLineSeparatorIndex);
        const matchedCommitMessage = gitLogLine.substr(gitLogLineSeparatorIndex + 1);

        const gitCheckoutOutput = spawnSync(
            'git',
            ['checkout', matchedFullReference],
            {cwd: sourceAbsoluteGuestPath},
        );

    }
}
