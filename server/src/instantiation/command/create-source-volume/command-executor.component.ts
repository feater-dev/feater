import {execSync, spawn} from 'child_process';
import {Injectable} from '@nestjs/common';
import {config} from '../../../config/config';
import {SimpleCommandExecutorComponentInterface} from '../../executor/simple-command-executor-component.interface';
import {SpawnHelper} from '../../helper/spawn-helper.component';
import {SimpleCommand} from '../../executor/simple-command';
import {CreateSourceVolumeCommand} from './command';
import {CommandLogger} from '../../logger/command-logger';
import {EnvVariablesSet} from '../../sets/env-variables-set';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';
import {CreateSourceVolumeCommandResultInterface} from './command-result.interface';
import {DockerVolumeHelperComponent} from '../../docker/docker-volume-helper.component';

const BUFFER_SIZE = 64 * 1048576; // 64M

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
        const {
            sourceId,
            sourceVolumeName,
            sourceAbsoluteGuestPath,
            workingDirectory,
            commandLogger,
        } = command as CreateSourceVolumeCommand;

        commandLogger.info(`Source ID: ${sourceId}`);
        commandLogger.info(`Volume name: ${sourceVolumeName}`);
        commandLogger.info(`Source absolute guest path: ${sourceAbsoluteGuestPath}`);

        commandLogger.info(`Creating source volume.`);
        await this.createVolume(sourceVolumeName, workingDirectory, commandLogger);

        commandLogger.info(`Determining source volume mountpoint.`);
        const sourceVolumeMountpoint = this.determineVolumeMountpoint(sourceVolumeName);

        commandLogger.info(`Copying source to volume.`);
        await this.copyFromAbsoluteGuestPathToVolume(
            sourceAbsoluteGuestPath,
            sourceVolumeName,
            workingDirectory,
            commandLogger
        );

        const {envVariables, featerVariables} = this.prepareVariables(
            sourceId,
            sourceVolumeName,
            sourceVolumeMountpoint
        );

        return {
            sourceVolumeMountpoint,
            envVariables,
            featerVariables,
        } as CreateSourceVolumeCommandResultInterface;
    }

    protected createVolume(
        sourceVolumeName: string,
        workingDirectory: string,
        commandLogger: CommandLogger,
    ): Promise<void> {
        return this.spawnHelper.promisifySpawnedWithHeader(
            this.dockerVolumeHelperComponent.spawnVolumeCreate(sourceVolumeName, workingDirectory),
            commandLogger,
            'create source volume',
        );
    }

    protected determineVolumeMountpoint(sourceVolumeName: string): string {
        const volumeInspect = JSON.parse(
            execSync(
                [config.instantiation.dockerBinaryPath, 'volume', 'inspect', sourceVolumeName].join(' '),
                {maxBuffer: BUFFER_SIZE},
            ).toString(),
        );

        return volumeInspect[0].Mountpoint;
    }

    protected prepareVariables(
        sourceId: string,
        sourceVolumeName: string,
        sourceVolumeMountpoint: string,
    ): {envVariables: EnvVariablesSet, featerVariables: FeaterVariablesSet} {
        const envVariables = new EnvVariablesSet();
        const featerVariables = new FeaterVariablesSet();

        envVariables.add(`FEATER__SOURCE_MOUNTPOINT__${sourceId.toUpperCase()}`, sourceVolumeMountpoint);
        envVariables.add(`FEATER__SOURCE_VOLUME__${sourceId.toUpperCase()}`, sourceVolumeName);
        featerVariables.add(`source_mountpoint__${sourceId.toLowerCase()}`, sourceVolumeMountpoint);
        featerVariables.add(`source_volume__${sourceId.toLowerCase()}`, sourceVolumeName);

        // TODO Depracted, remove later. Replaced volume name below.
        envVariables.add(`FEATER__HOST_SOURCE_PATH__${sourceId.toUpperCase()}`, sourceVolumeMountpoint);
        featerVariables.add(`host_source_path__${sourceId.toLowerCase()}`, sourceVolumeMountpoint);

        return {
            envVariables,
            featerVariables,
        };
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
