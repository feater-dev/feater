import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {DeployKeyRepository} from '../../../persistence/repository/deploy-key.repository';
import {MoveSourceToVolumeCommand} from './command';
import {SimpleCommand} from '../../executor/simple-command';
import {CommandLogger} from '../../logger/command-logger';
import {spawn} from 'child_process';
import {environment} from '../../../environments/environment';
import {SpawnHelper} from '../../helper/spawn-helper.component';
import * as rimraf from 'rimraf';

@Injectable()
export class MoveSourceToVolumeCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof MoveSourceToVolumeCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = (command as MoveSourceToVolumeCommand);
        const logger = typedCommand.commandLogger;

        logger.info(`Volume name: ${typedCommand.volumeName}`);

        await this.copySourceToVolume(
            typedCommand.absoluteHostSourceDirPath,
            typedCommand.volumeName,
            typedCommand.absoluteGuestSourceDirPath,
            logger,
        );

        if (typedCommand.removeSource) {
            await this.removeSource(
                typedCommand.absoluteGuestSourceDirPath,
                logger,
            );
        }

        return {};
    }

    protected copySourceToVolume(
        absoluteHostSourceDirPath: string,
        volumeName: string,
        workingDirectory: string,
        logger: CommandLogger,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                [
                    'run', '--rm',
                    '-v', `${absoluteHostSourceDirPath}:/source`,
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

    protected removeSource(
        absoluteGuestSourceDirPath: string,
        logger: CommandLogger,
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            rimraf(absoluteGuestSourceDirPath, (err) => {
                if (err) {
                    reject();

                    return;
                }
                logger.info(`Source directory removed.`);
                resolve();
            });
        });
    }
}
