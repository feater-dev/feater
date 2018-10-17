import * as nodegit from 'nodegit';
import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {DeployKeyRepository} from '../../../persistence/repository/deploy-key.repository';
import {CloneSourceCommand} from './command';
import {DeployKeyInterface} from '../../../persistence/interface/deploy-key.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {BaseLogger} from '../../../logger/base-logger';

@Injectable()
export class CloneSourceCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    readonly PROGRESS_THROTTLE_PERIOD = 10;

    constructor(
        private readonly deployKeyRepository: DeployKeyRepository,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof CloneSourceCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = (command as CloneSourceCommand);
        const deployKey = await this.deployKeyRepository.findBySshCloneUrl(typedCommand.sshCloneUrl);
        const repository = await this.cloneRepository(typedCommand, deployKey);

        await this.checkoutReference(typedCommand, repository);

        return {};
    }

    protected cloneRepository(
        command: CloneSourceCommand,
        deployKey: DeployKeyInterface,
    ): Promise<nodegit.Repository> {
        return nodegit.Clone.clone(
            command.sshCloneUrl,
            command.absoluteGuestInstanceDirPath,
            this.createCloneOptions(deployKey),
        );
    }

    protected createCloneOptions(deployKey: DeployKeyInterface): any {

        const logger = new BaseLogger(); // TODO Replace with real logger.

        return {
            fetchOpts: {
                callbacks: {
                    credentials: (repoUrl, username) => nodegit.Cred.sshKeyMemoryNew(
                        username,
                        deployKey.publicKey,
                        deployKey.privateKey,
                        deployKey.passphrase,
                    ),
                    transferProgress: {
                        throttle: this.PROGRESS_THROTTLE_PERIOD,
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
    }

    protected async checkoutReference(command: CloneSourceCommand, repo: nodegit.Repository): Promise<void> {
        switch (command.referenceType) {
            case 'branch':
                const reference = await repo.getBranch(`refs/remotes/origin/${command.referenceName}`);
                await repo.checkoutRef(reference);

                return;

            case 'tag': // TODO Allow to checkout tag.
            case 'commit': // TODO Allow to checkout commit.
            default:
                throw new Error();
        }
    }

}
