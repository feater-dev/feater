import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {SpawnHelper} from '../../helper/spawn-helper.component';
import {SimpleCommand} from '../../executor/simple-command';
import {RemoveVolumeCommand} from './command';
import {CommandLogger} from '../../logger/command-logger';
import {DockerVolumeHelperComponent} from '../../docker/docker-volume-helper.component';

@Injectable()
export class RemoveVolumeCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly dockerVolumeHelperComponent: DockerVolumeHelperComponent,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof RemoveVolumeCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            dockerVolumeName,
            workingDirectory,
            commandLogger,
        } = command as RemoveVolumeCommand;

        commandLogger.info(`Volume name: ${dockerVolumeName}`);

        commandLogger.info(`Removing volume.`);
        await this.removeVolume(
            dockerVolumeName,
            workingDirectory,
            commandLogger,
        );
    }

    protected removeVolume(
        dockerVolumeName: string,
        workingDirectory: string,
        commandLogger: CommandLogger,
    ): Promise<void> {
        return this.spawnHelper.promisifySpawnedWithHeader(
            this.dockerVolumeHelperComponent.spawnVolumeRemove(dockerVolumeName, workingDirectory),
            commandLogger,
            'remove source volume',
        );
    }

}
