import {spawn} from 'child_process';
import * as tar from 'tar';
import * as mkdirRecursive from 'mkdir-recursive';

import {Injectable} from '@nestjs/common';

import {environment} from '../../environment/environment';

import {AssetRepository} from '../../persistence/repository/asset.repository';
import {JobExecutorInterface} from './job-executor';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {LoggerInterface} from '../../logger/logger-interface';
import {BuildJobInterface, JobInterface} from './job';
import {Build} from '../build';
import {SpawnHelper} from '../spawn-helper.component';
import {AssetHelper} from '../asset-helper.component';

export class CreateVolumeFromAssetJob implements BuildJobInterface {

    constructor(
        readonly build: Build,
        readonly volumeId: string,
        readonly assetId: string,
    ) {}

}

@Injectable()
export class CreateVolumeFromAssetJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly assetRepository: AssetRepository,
        private readonly assetHelper: AssetHelper,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof CreateVolumeFromAssetJob);
    }

    async execute(job: JobInterface, data: any): Promise<void> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as CreateVolumeFromAssetJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);

        logger.info(`Creating volume '${buildJob.volumeId}' from asset '${buildJob.assetId}'.`);

        const asset = await this.assetHelper.findUploadedById(buildJob.assetId);
        const volumeName = `${environment.instantiation.containerNamePrefix}${buildJob.build.id}_${buildJob.volumeId}`;

        const uploadPaths = this.assetHelper.getUploadPaths(asset);
        const extractPaths = this.assetHelper.getExtractPaths(asset, buildJob.build.id, buildJob.volumeId);

        mkdirRecursive.mkdirSync(extractPaths.absolute.guest);

        await tar.extract({
            file: uploadPaths.absolute.guest,
            cwd: extractPaths.absolute.guest,
        });

        await this.spawnVolumeCreate(
            buildJob.volumeId,
            volumeName,
            buildJob.build.fullBuildPath,
            logger,
        );

        await this.spawnCopyVolumeUsingTemporaryContainer(
            extractPaths.absolute.host,
            volumeName,
            buildJob.build.fullBuildPath,
            logger,
        );

        buildJob.build.envVariables.add(`FEAT__ASSET_VOLUME__${buildJob.volumeId.toUpperCase()}`, volumeName);
    }

    protected spawnVolumeCreate(
        volumeId: string,
        volumeName: string,
        workingDirectory: string,
        logger: LoggerInterface,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                ['volume', 'create', '--name', volumeName],
                {cwd: workingDirectory},
            );

            this.spawnHelper.handleSpawned(
                spawned, logger, resolve, reject,
                (exitCode: number) => {
                    logger.error(`Failed to extract asset, exit code ${exitCode}.`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to extract asset, error ${error.message}.`, {});
                },
            );
        });
    }

    protected spawnCopyVolumeUsingTemporaryContainer(
        absoluteExtractedAssetHostPath: string,
        volumeName: string,
        workingDirectory: string,
        logger: LoggerInterface,
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

            this.spawnHelper.handleSpawned(
                spawned, logger, resolve, reject,
                (exitCode: number) => {
                    logger.error(`Failed to copy files from asset to volume, exit code ${exitCode}.`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to copy files from asset to volume, error ${error.message}.`, {});
                },
            );
        });
    }

}
