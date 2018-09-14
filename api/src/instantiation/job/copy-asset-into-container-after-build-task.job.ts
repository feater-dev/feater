import {spawn} from 'child_process';
import * as _ from 'lodash';

import {Component} from '@nestjs/common';

import {environment} from '../../environment/environment';

import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {Build} from '../build';
import {AssetHelper, AssetUploadPathsInterface} from '../asset-helper.component';
import {SpawnHelper} from '../spawn-helper.component';
import {LoggerInterface} from '../../logger/logger-interface';

export class CopyAssetIntoContainerAfterBuildTaskJob implements BuildJobInterface {

    constructor(
        readonly build: Build,
        readonly serviceId: string,
        readonly assetId: string,
        readonly destinationPath: string, // TODO Does it behave like relative path too?
    ) {}

}

@Component()
export class CopyAssetIntoContainerAfterBuildTaskJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly assetHelper: AssetHelper,
        private readonly spawnHelper: SpawnHelper,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof CopyAssetIntoContainerAfterBuildTaskJob);
    }

    async execute(job: JobInterface, data: any): Promise<void> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as CopyAssetIntoContainerAfterBuildTaskJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);

        logger.info(`Copying asset '${buildJob.assetId}' into container for service ${buildJob.serviceId}.`);

        const matchedService = _.find(buildJob.build.services, (service) => service.id === buildJob.serviceId);
        const asset = await this.assetHelper.findUploadedById(buildJob.assetId);
        const uploadPaths = this.assetHelper.getUploadPaths(asset);

        await this.spawnDockerCopy(
            uploadPaths,
            matchedService.containerId,
            buildJob.destinationPath,
            buildJob.build.fullBuildPath,
            logger,
        );
    }

    protected spawnDockerCopy(
        uploadPaths: AssetUploadPathsInterface,
        containerId: string,
        destinationPath: string,
        workingDirectory: string,
        logger: LoggerInterface,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const spawned = spawn(
                environment.instantiation.dockerBinaryPath,
                ['cp', uploadPaths.absolute.guest, `${containerId}:${destinationPath}`],
                {cwd: workingDirectory},
            );

            this.spawnHelper.handleSpawned(
                spawned, logger, resolve, reject,
                (exitCode: number) => {
                    logger.error(`Failed to copy asset to container, exit code ${exitCode}.`, {});
                },
                (error: Error) => {
                    logger.error(`Failed to copy asset to container, error ${error.message}.`, {});
                },
            );
        });
    }
}
