import {createReadStream} from 'fs';
import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {config} from '../../../config/config';
import {AssetRepository} from '../../../persistence/repository/asset.repository';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {SpawnHelper} from '../../helper/spawn-helper.component';
import {AssetHelper} from '../../../persistence/helper/asset-helper.component';
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

        const asset = await this.assetRepository.findUploadedById(typedCommand.assetId);

        const dockerVolumeName = `${typedCommand.containerNamePrefix}_asset_volume_${typedCommand.volumeId}`;
        logger.info(`Volume name: ${dockerVolumeName}`);

        logger.info(`Creating volume.`);
        await this.spawnVolumeCreate(
            dockerVolumeName,
            typedCommand.absoluteGuestInstanceDirPath,
            logger,
        );

        logger.info(`Extracting asset to volume.`);
        await this.extractAssetToVolume(
            this.assetHelper.getUploadPaths(asset).absolute,
            dockerVolumeName,
            typedCommand.absoluteGuestInstanceDirPath,
            logger,
        );

        const envVariables = new EnvVariablesSet();
        envVariables.add(`FEATER__ASSET_VOLUME__${typedCommand.volumeId.toUpperCase()}`, dockerVolumeName);
        logger.infoWithEnvVariables(envVariables);

        const featerVariables = new FeaterVariablesSet();
        featerVariables.add(`asset_volume__${typedCommand.volumeId.toLowerCase()}`, dockerVolumeName);
        logger.infoWithFeaterVariables(featerVariables);

        return {
            dockerVolumeName,
            envVariables,
            featerVariables,
        } as CreateVolumeFromAssetCommandResultInterface;
    }

    protected spawnVolumeCreate(
        volumeName: string,
        workingDirectory: string,
        logger: CommandLogger,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                config.instantiation.dockerBinaryPath,
                ['volume', 'create', '--name', volumeName],
                {cwd: workingDirectory},
            );

            this.spawnHelper.handleSpawned(
                spawned,
                logger,
                resolve,
                reject,
                () => {
                    logger.info(`Completed creating asset volume.`, {});
                },
                (exitCode: number) => {
                    logger.error(`Failed to create asset volume.`, {});
                    logger.error(`Exit code: ${exitCode}`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to create asset volume.`);
                    logger.error(`Error message: ${error.message}`, {});
                },
            );
        });
    }

    protected extractAssetToVolume(
        absoluteUploadedAssetGuestPath: string,
        volumeName: string,
        workingDirectory: string,
        logger,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawnedExtractAndCreateVolume = spawn(
                config.instantiation.dockerBinaryPath,
                [
                    'run', '--rm', '-i',
                    '-v', `${volumeName}:/target`,
                    'alpine', 'ash', '-c', 'cat > /source.tar.gz && tar -zxvf /source.tar.gz -C /target/',
                ],
                {cwd: workingDirectory},
            );

            createReadStream(absoluteUploadedAssetGuestPath).pipe(spawnedExtractAndCreateVolume.stdin);

            this.spawnHelper.handleSpawned(
                spawnedExtractAndCreateVolume,
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
