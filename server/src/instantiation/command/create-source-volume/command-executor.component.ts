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
import * as path from 'path';

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
            sourceDockerVolumeName,
            sourceId,
            sourceAbsoluteGuestPath,
            workingDirectory,
            sourceVolumeRelativePath,
            sourceVolumeId,
            commandLogger,
        } = command as CreateSourceVolumeCommand;

        if (sourceVolumeId) {
            commandLogger.info(`Source volume ID: ${sourceVolumeId}`);
        }
        commandLogger.info(`Source volume name: ${sourceDockerVolumeName}`);
        commandLogger.info(`Source ID: ${sourceId}`);
        commandLogger.info(`Source volume relative path: ${sourceVolumeRelativePath}`);
        commandLogger.info(`Source absolute guest path: ${sourceAbsoluteGuestPath}`);

        commandLogger.info(`Creating source volume.`);
        await this.createVolume(sourceDockerVolumeName, workingDirectory, commandLogger);

        commandLogger.info(`Copying source to volume.`);
        await this.copyFromAbsoluteGuestPathToVolume(
            path.join(sourceAbsoluteGuestPath, sourceVolumeRelativePath || ''),
            sourceDockerVolumeName,
            workingDirectory,
            commandLogger,
        );

        const envVariables = new EnvVariablesSet();
        const featerVariables = new FeaterVariablesSet();

        if (sourceVolumeId) {
            this.prepareVariables(sourceVolumeId, sourceDockerVolumeName, envVariables, featerVariables);
        }

        return {
            envVariables,
            featerVariables,
        } as CreateSourceVolumeCommandResultInterface;
    }

    protected createVolume(
        sourceDockerVolumeName: string,
        workingDirectory: string,
        commandLogger: CommandLogger,
    ): Promise<void> {
        return this.spawnHelper.promisifySpawnedWithHeader(
            this.dockerVolumeHelperComponent.spawnVolumeCreate(sourceDockerVolumeName, workingDirectory),
            commandLogger,
            'create source volume',
        );
    }

    protected prepareVariables(
        sourceId: string,
        sourceDockerVolumeName: string,
        envVariables: EnvVariablesSet,
        featerVariables: FeaterVariablesSet,
    ): void {
        envVariables.add(`FEATER__SOURCE_VOLUME__${sourceId.toUpperCase()}`, sourceDockerVolumeName);
        featerVariables.add(`source_volume__${sourceId.toLowerCase()}`, sourceDockerVolumeName);
    }

    protected copyFromAbsoluteGuestPathToVolume(
        absoluteGuestPath: string,
        dockerVolumeName: string,
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
                '-v', `${dockerVolumeName}:/target`,
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
