import * as nodegit from 'nodegit';
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
            logger.info(`Using deploy key to clone over SSH.`);
            deployKey = await this.deployKeyRepository.findOneByCloneUrl(typedCommand.cloneUrl);
            logger.info(`Deploy key fingerprint: ${sshFingerprint(deployKey.publicKey)}`);
        } else {
            deployKey = null;
            logger.info(`Not using deploy key.`);
        }
        const repository = await nodegit.Clone.clone(
            typedCommand.cloneUrl,
            typedCommand.sourceAbsoluteGuestPath,
            this.createCloneOptions(typedCommand.commandLogger, deployKey),
        );
        logger.info(`Cloning completed.`);

        await this.checkoutReference(
            typedCommand.referenceType,
            typedCommand.referenceName,
            repository,
            logger
        );

        const dockerVolumeName = `${typedCommand.dockerComposeProjectName}_source_volume_${typedCommand.sourceId.toLowerCase()}`;
        logger.info(`Volume name: ${dockerVolumeName}`);

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

        logger.infoWithEnvVariables(envVariables);
        logger.infoWithFeaterVariables(featerVariables);

        return {
            dockerVolumeName,
            envVariables,
            featerVariables,
        } as CloneSourceCommandResultInterface;
    }

    protected createCloneOptions(logger: CommandLogger, deployKey?: DeployKeyInterface): any {
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
                    logger.info(`Cloning progress ${progress}%.`);
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
        logger: CommandLogger
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

        throw new Error(`Unknown reference type '${referenceType}'.`);
    }
}
