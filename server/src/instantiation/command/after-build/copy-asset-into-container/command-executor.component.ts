import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {config} from '../../../../config/config';
import {SimpleCommandExecutorComponentInterface} from '../../../executor/simple-command-executor-component.interface';
import {AssetHelper, AssetUploadPathsInterface} from '../../../../persistence/helper/asset-helper.component';
import {SpawnHelper} from '../../../helper/spawn-helper.component';
import {SimpleCommand} from '../../../executor/simple-command';
import {CopyAssetIntoContainerCommand} from './command';
import {CommandLogger} from '../../../logger/command-logger';
import {AssetRepository} from '../../../../persistence/repository/asset.repository';

@Injectable()
export class CopyAssetIntoContainerCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly assetRepository: AssetRepository,
        private readonly assetHelper: AssetHelper,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof CopyAssetIntoContainerCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as CopyAssetIntoContainerCommand;
        const commandLogger = typedCommand.commandLogger;

        const asset = await this.assetRepository.findUploadedById(typedCommand.assetId);
        const uploadPaths = this.assetHelper.getUploadPaths(asset);

        await this.copyAssetToContainer(
            uploadPaths,
            typedCommand.containerId,
            typedCommand.destinationPath,
            typedCommand.absoluteGuestInstanceDirPath,
            commandLogger,
        );

        return {};
    }

    protected copyAssetToContainer(
        uploadPaths: AssetUploadPathsInterface,
        containerId: string,
        destinationPath: string,
        workingDirectory: string,
        commandLogger: CommandLogger,
    ): Promise<void> {
        return this.spawnHelper.promisifySpawnedWithHeader(
            spawn(
                config.instantiation.dockerBinaryPath,
                ['cp', uploadPaths.absolute, `${containerId}:${destinationPath}`],
                {cwd: workingDirectory},
            ),
            commandLogger,
            'copy asset to container',
        );
    }
}
