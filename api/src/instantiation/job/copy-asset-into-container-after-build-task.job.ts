import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {Build} from '../build';
import {Config} from '../../config/config.component';
import {AssetRepository} from '../../persistence/repository/asset.repository';
import {spawn} from 'child_process';
import * as _ from 'lodash';
import * as path from 'path';
import * as split from 'split';

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
        private readonly config: Config,
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly assetRepository: AssetRepository,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof CopyAssetIntoContainerAfterBuildTaskJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as CopyAssetIntoContainerAfterBuildTaskJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);

        return new Promise<any>((resolve, reject) => {

            const matchedService = _.find(buildJob.build.services, (service) => service.id === buildJob.serviceId);

            this.assetRepository
                .find({id: buildJob.assetId, filename: {$exists: true}}, 0, 1)
                .then((assets) => {
                    if (!assets.length) {
                        logger.error(`Failed to find asset '${buildJob.assetId}'.`);
                        reject();

                        return;
                    }

                    const asset = assets[0];

                    logger.info(`Copying asset '${buildJob.assetId}' into container for service ${matchedService.id}.`);

                    const command = 'docker';
                    const commandArgs = [
                        'cp',
                        path.join(this.config.guestPaths.asset, asset.filename),
                        `${matchedService.containerId}:${buildJob.destinationPath}`,
                    ];

                    const spawnedCommand = spawn(command, commandArgs, {cwd: buildJob.build.fullBuildPath});

                    spawnedCommand.stdout
                        .pipe(split())
                        .on('data', line => {
                            logger.info(line); // Is it a string or is it necessary to use .toString() like before?
                        });

                    spawnedCommand.stderr
                        .pipe(split())
                        .on('data', line => {
                            logger.info(line);
                        });

                    spawnedCommand.on('error', error => {
                        logger.error(`Failed to copy file into container (error message: '${error.message}').`);
                        reject(error);
                    });

                    const onCloseOrExit = code => {
                        if (0 !== code) {
                            logger.error(`Failed to copy file into container with code ${code}.`);
                            reject(code);

                            return;
                        }
                        resolve();
                    };

                    spawnedCommand.on('close', onCloseOrExit);
                    spawnedCommand.on('exit', onCloseOrExit);
                });
        });

    }

}
