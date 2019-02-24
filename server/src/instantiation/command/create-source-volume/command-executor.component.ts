import {spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {config} from '../../../config/config';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {SpawnHelper} from '../../helper/spawn-helper.component';
import {SimpleCommand} from '../../executor/simple-command';
import {CreateSourceVolumeCommand} from './command';
import {CommandLogger} from '../../logger/command-logger';
import {DockerVolumeHelperComponent} from "../../../docker/docker-volume-helper.component";

@Injectable()
export class CreateSourceVolumeCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly dockerVolumeHelperComponent: DockerVolumeHelperComponent,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof CreateSourceVolumeCommand);
    }

    async execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as CreateSourceVolumeCommand;
        const commandLogger = typedCommand.commandLogger;

        commandLogger.info(`Source ID: ${typedCommand.sourceId}`);
        commandLogger.info(`Volume name: ${typedCommand.sourceDockerVolumeName}`);
        commandLogger.info(`Source absolute guest path: ${typedCommand.sourceAbsoluteGuestPath}`);

        commandLogger.info(`Creating volume.`);
        await this.createSourceVolume(
            typedCommand.sourceDockerVolumeName,
            typedCommand.workingDirectory,
            commandLogger
        );

        commandLogger.info(`Copying source to volume.`);
        await this.copyFromAbsoluteGuestPathToVolume(
            typedCommand.sourceAbsoluteGuestPath,
            typedCommand.sourceDockerVolumeName,
            typedCommand.workingDirectory,
            commandLogger
        );
    }

    protected createSourceVolume(
        volumeName: string,
        workingDirectory: string,
        commandLogger: CommandLogger,
    ): Promise<void> {
        return this.spawnHelper.promisifySpawnedWithHeader(
            this.dockerVolumeHelperComponent.spawnVolumeCreate(volumeName, workingDirectory),
            commandLogger,
            'create source volume',
        );
    }

    protected copyFromAbsoluteGuestPathToVolume(
        absoluteGuestPath: string,
        volumeName: string,
        workingDirectory: string,
        commandLogger: CommandLogger,
    ): Promise<void> {
        const createSourceArchiveSpawned = spawn(
            'sh',
            ['-c', `cd ${absoluteGuestPath} && tar -czf - \`ls -A -1\``],
            {cwd: workingDirectory},
        );
        const createSourceArchivePromise = this.spawnHelper.promisifySpawnedWithHeader(
            createSourceArchiveSpawned,
            commandLogger,
            'create source archive',
            {muteStdout: true},
        );

        const extractSourceArchiveToVolumeSpawned = spawn(
            config.instantiation.dockerBinaryPath,
            [
                'run', '--rm', '-i',
                '-v', `${volumeName}:/target`,
                'alpine:3.9', 'ash', '-c', 'cat > /source.tar.gz && tar -zxvf /source.tar.gz -C /target/',
            ],
            {cwd: workingDirectory},
        );
        const extractSourceArchiveToVolumePromise = this.spawnHelper.promisifySpawnedWithHeader(
            extractSourceArchiveToVolumeSpawned,
            commandLogger,
            'extract source archive to volume',
            {muteStdout: true},
        );

        createSourceArchiveSpawned.stdout.pipe(extractSourceArchiveToVolumeSpawned.stdin);

        return Promise
            .all([
                createSourceArchivePromise,
                extractSourceArchiveToVolumePromise,
            ])
            .then(() => {});
    }

}
