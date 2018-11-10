import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {environment} from '../../../environments/environment';
import {AssetRepository} from '../../../persistence/repository/asset.repository';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {SpawnHelper} from '../../helper/spawn-helper.component';
import {AssetHelper} from '../../helper/asset-helper.component';
import {SimpleCommand} from '../../executor/simple-command';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {CreateVolumeFromAssetCommandResultInterface} from './command-result.interface';
import {CreateVolumeFromAssetCommand} from './command';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';
import {CommandLogger} from '../../logger/command-logger';

@Injectable()
export class CreateVolumeFromAssetCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly assetRepository: AssetRepository,
        private readonly assetHelper: AssetHelper,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof CreateVolumeFromAssetCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as CreateVolumeFromAssetCommand;
        const logger = typedCommand.commandLogger;

        logger.info(`Asset ID: ${typedCommand.assetId}`);
        logger.info(`Volume ID: ${typedCommand.volumeId}`);

        const asset = await this.assetHelper.findUploadedById(typedCommand.assetId);

        const volumeName = `${typedCommand.containerNamePrefix}_${typedCommand.volumeId}`;
        logger.info(`Volume name: ${volumeName}`);

        logger.info(`Creating volume.`);
        await this.spawnVolumeCreate(
            typedCommand.volumeId,
            volumeName,
            typedCommand.absoluteGuestInstanceDirPath,
            logger,
        );

        logger.info(`Extracting asset to volume.`);
        await this.spawnExtractAssetToVolume(
            this.assetHelper.getUploadPaths(asset).absolute.host,
            volumeName,
            typedCommand.absoluteGuestInstanceDirPath,
            logger,
        );

        const envVariables = new EnvVariablesSet();
        const featerVariables = new FeaterVariablesSet();
        envVariables.add(`FEATER__ASSET_VOLUME__${typedCommand.volumeId.toUpperCase()}`, volumeName);
        featerVariables.add(`asset_volume__${typedCommand.volumeId.toLowerCase()}`, volumeName);
        logger.info(`Added environmental variables:${
            envVariables.isEmpty()
                ? ' none'
                : '\n' + JSON.stringify(envVariables.toMap(), null, 2)
        }`);
        logger.info(`Added Feater variables:${
            featerVariables.isEmpty()
                ? ' none'
                : '\n' + JSON.stringify(featerVariables.toMap(), null, 2)
        }`);

        return {envVariables, featerVariables} as CreateVolumeFromAssetCommandResultInterface;
    }

    protected spawnVolumeCreate(
        volumeId: string,
        volumeName: string,
        workingDirectory: string,
        logger: CommandLogger,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                ['volume', 'create', '--name', volumeName],
                {cwd: workingDirectory},
            );

            this.spawnHelper.handleSpawned(
                spawned,
                logger,
                resolve,
                reject,
                () => {
                    logger.info(`Completed creating volume.`, {});
                },
                (exitCode: number) => {
                    logger.error(`Failed to extract asset.`, {});
                    logger.error(`Exit code: ${exitCode}`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to extract asset.`);
                    logger.error(`Error message: ${error.message}`, {});
                },
            );
        });
    }

    protected spawnExtractAssetToVolume(
        absoluteUploadedAssetHostPath: string,
        volumeName: string,
        workingDirectory: string,
        logger,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                [
                    'run', '--rm',
                    '-v', `${absoluteUploadedAssetHostPath}:/source.tar.gz`,
                    '-v', `${volumeName}:/target`,
                    'alpine', 'ash', '-c', 'tar -zxvf /source.tar.gz -C /target/',
                ],
                {cwd: workingDirectory},
            );

            this.spawnHelper.handleSpawned(
                spawned,
                logger,
                resolve,
                reject,
                () => {
                    logger.info(`Completed extracting asset to volume.`, {});
                },
                (exitCode: number) => {
                    logger.error(`Failed to copy files from asset to volume.`, {});
                    logger.error(`Exit code: ${exitCode}`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to copy files from asset to volume.`, {});
                    logger.error(`Error message: ${error.message}`, {});
                },
            );
        });
    }

}
