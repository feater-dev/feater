import {spawn} from 'child_process';
import * as path from 'path';
import * as rimraf from 'rimraf';
import {Injectable} from '@nestjs/common';
import {environment} from '../../../../environment/environment';
import {SimpleCommandExecutorComponentInterface} from '../../simple-command-executor-component.interface';
import {AssetHelper, AssetUploadPathsInterface} from '../../../helper/asset-helper.component';
import {SpawnHelper} from '../../../helper/spawn-helper.component';
import {SimpleCommand} from '../../../executor/simple-command';
import {CopyAssetIntoContainerCommand} from './command';
import {BaseLogger} from '../../../../logger/base-logger';
import * as mkdirRecursive from 'mkdir-recursive';

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

        const asset = await this.assetHelper.findUploadedById(typedCommand.assetId);
        const uploadPaths = this.assetHelper.getUploadPaths(asset);

        await this.spawnDockerCopy(
            uploadPaths,
            typedCommand.containerId,
            typedCommand.destinationPath,
            typedCommand.absoluteGuestInstanceDirPath,
        );

        return {};
    }

    protected spawnDockerCopy(
        uploadPaths: AssetUploadPathsInterface,
        containerId: string,
        destinationPath: string,
        workingDirectory: string,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                ['cp', uploadPaths.absolute.guest, `${containerId}:${destinationPath}`],
                {cwd: workingDirectory},
            );

            this.spawnHelper.handleSpawned(
                spawned,
                new BaseLogger(), // TODO Provide real logger.
                resolve,
                reject,
                (exitCode: number) => {
                    // logger.error(`Failed to copy asset to container, exit code ${exitCode}.`, {});
                },
                (error: Error) => {
                    // logger.error(`Failed to copy asset to container, error ${error.message}.`, {});
                },
            );
        });
    }
}
