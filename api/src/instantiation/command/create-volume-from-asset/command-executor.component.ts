import {spawn} from 'child_process';
import * as tar from 'tar';
import * as path from 'path';
import * as mkdirRecursive from 'mkdir-recursive';
import {Injectable} from '@nestjs/common';
import {environment} from '../../../environment/environment';
import {AssetRepository} from '../../../persistence/repository/asset.repository';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SpawnHelper} from '../../helper/spawn-helper.component';
import {AssetHelper} from '../../helper/asset-helper.component';
import {SimpleCommand} from '../../executor/simple-command';
import {BaseLogger} from '../../../logger/base-logger';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {CreateVolumeFromAssetCommandResultInterface} from './command-result.interface';
import {CreateVolumeFromAssetCommand} from './command';

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

        const asset = await this.assetHelper.findUploadedById(typedCommand.assetId);
        const volumeName = `${typedCommand.containerNamePrefix}_${typedCommand.volumeId}`;

        mkdirRecursive.mkdirSync(typedCommand.absoluteGuestAssetExtractDirPath);

        await tar.extract({
            file: this.assetHelper.getUploadPaths(asset).absolute.guest,
            cwd: typedCommand.absoluteGuestAssetExtractDirPath,
        });

        await this.spawnVolumeCreate(
            typedCommand.volumeId,
            volumeName,
            typedCommand.absoluteGuestInstanceDirPath,
        );

        await this.spawnCopyVolumeUsingTemporaryContainer(
            typedCommand.absoluteHostAssetExtractDirPath,
            volumeName,
            typedCommand.absoluteGuestInstanceDirPath,
        );

        const envVariables = new EnvVariablesSet();
        envVariables.add(`FEAT__ASSET_VOLUME__${typedCommand.volumeId.toUpperCase()}`, volumeName);

        return {envVariables} as CreateVolumeFromAssetCommandResultInterface;
    }

    protected spawnVolumeCreate(
        volumeId: string,
        volumeName: string,
        workingDirectory: string,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                ['volume', 'create', '--name', volumeName],
                {cwd: workingDirectory},
            );

            const logger = new BaseLogger(); // TODO Provide real logger.

            this.spawnHelper.handleSpawned(
                spawned, logger, resolve, reject,
                (exitCode: number) => {
                    // logger.error(`Failed to extract asset, exit code ${exitCode}.`, {});
                },
                (error: Error) => {
                    // logger.error(`Failed to extract asset, error ${error.message}.`, {});
                },
            );
        });
    }

    protected spawnCopyVolumeUsingTemporaryContainer(
        absoluteExtractedAssetHostPath: string,
        volumeName: string,
        workingDirectory: string,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                [
                    'run', '--rm',
                    '-v', `${absoluteExtractedAssetHostPath}:/source`,
                    '-v', `${volumeName}:/target`,
                    'alpine', 'ash', '-c', 'cp -av /source/* /target',
                ],
                {cwd: workingDirectory},
            );

            const logger = new BaseLogger(); // TODO Provide real logger.

            this.spawnHelper.handleSpawned(
                spawned, logger, resolve, reject,
                (exitCode: number) => {
                    // logger.error(`Failed to copy files from asset to volume, exit code ${exitCode}.`, {});
                },
                (error: Error) => {
                    // logger.error(`Failed to copy files from asset to volume, error ${error.message}.`, {});
                },
            );
        });
    }

}
