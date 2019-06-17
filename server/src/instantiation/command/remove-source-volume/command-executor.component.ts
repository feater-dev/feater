import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {SpawnHelper} from '../../helper/spawn-helper.component';
import {SimpleCommand} from '../../executor/simple-command';
import {RemoveSourceVolumeCommand} from './command';
import {CommandLogger} from '../../logger/command-logger';
import {DockerVolumeHelperComponent} from '../../docker/docker-volume-helper.component';

@Injectable()
export class RemoveSourceVolumeCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly dockerVolumeHelperComponent: DockerVolumeHelperComponent,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof RemoveSourceVolumeCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            sourceId,
            sourceDockerVolumeName,
            workingDirectory,
            commandLogger,
        } = command as RemoveSourceVolumeCommand;

        commandLogger.info(`Source ID: ${sourceId}`);
        commandLogger.info(`Volume name: ${sourceDockerVolumeName}`);

        commandLogger.info(`Removing volume.`);
        await this.removeSourceVolume(
            sourceDockerVolumeName,
            workingDirectory,
            commandLogger
        );
    }

    protected removeSourceVolume(
        volumeName: string,
        workingDirectory: string,
        commandLogger: CommandLogger,
    ): Promise<void> {
        return this.spawnHelper.promisifySpawnedWithHeader(
            this.dockerVolumeHelperComponent.spawnVolumeRemove(volumeName, workingDirectory),
            commandLogger,
            'remove source volume',
        );
    }

}
