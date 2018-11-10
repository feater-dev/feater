import {spawn} from 'child_process';
import * as path from 'path';
import * as rimraf from 'rimraf';
import {Injectable} from '@nestjs/common';
import {environment} from '../../../../environments/environment';
import {SimpleCommandExecutorComponentInterface} from '../../../executor/simple-command-executor-component.interface';
import {AssetHelper, AssetUploadPathsInterface} from '../../../helper/asset-helper.component';
import {SpawnHelper} from '../../../helper/spawn-helper.component';
import {SimpleCommand} from '../../../executor/simple-command';
import {CopyAssetIntoContainerCommand} from './command';
import {BaseLogger} from '../../../../logger/base-logger';
import * as mkdirRecursive from 'mkdir-recursive';
import {CommandLogger} from '../../../logger/command-logger';

@Injectable()
export class CopyAssetIntoContainerCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly assetHelper: AssetHelper,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof CopyAssetIntoContainerCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as CopyAssetIntoContainerCommand;
        const logger = typedCommand.commandLogger;

        const asset = await this.assetHelper.findUploadedById(typedCommand.assetId);
        const uploadPaths = this.assetHelper.getUploadPaths(asset);

        await this.spawnDockerCopy(
            uploadPaths,
            typedCommand.containerId,
            typedCommand.destinationPath,
            typedCommand.absoluteGuestInstanceDirPath,
            logger,
        );

        return {};
    }

    protected spawnDockerCopy(
        uploadPaths: AssetUploadPathsInterface,
        containerId: string,
        destinationPath: string,
        workingDirectory: string,
        logger: CommandLogger,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                ['cp', uploadPaths.absolute.guest, `${containerId}:${destinationPath}`],
                {cwd: workingDirectory},
            );

            this.spawnHelper.handleSpawned(
                spawned,
                logger,
                resolve,
                reject,
                () => {},
                (exitCode: number) => {
                    logger.error(`Failed to copy asset to container.`, {});
                    logger.error(`Exit code ${exitCode}`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to copy asset to container.`, {});
                    logger.error(`Error ${error.message}`, {});
                },
            );
        });
    }
}
