import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {Build} from '../build';
import {Config} from '../../config/config.component';
import {AssetRepository} from '../../persistence/repository/asset.repository';
import {execSync} from 'child_process';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as tar from 'tar';

const BUFFER_SIZE = 16 * 1024 * 1024; // 16MB

export class CreateVolumeFromAssetAfterBuildTaskJob implements BuildJobInterface {

    constructor(
        readonly build: Build,
        readonly assetId: string,
        readonly volumeName: string, // TODO Does it behave like relative path too?
    ) {}

}

@Component()
export class CreateVolumeFromAssetAfterBuildTaskJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly config: Config,
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly assetRepository: AssetRepository,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof CreateVolumeFromAssetAfterBuildTaskJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as CreateVolumeFromAssetAfterBuildTaskJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);

        return new Promise<any>((resolve, reject) => {

            this.assetRepository
                .find({id: buildJob.assetId, filename: {$exists: true}}, 0, 1)
                .then(assets => {

                    if (!assets.length) {
                        logger.error(`Failed to find asset '${buildJob.assetId}'.`);
                        reject();

                        return;
                    }

                    return assets[0];
                })
                .then(asset => {

                    const absoluteAssetGuestPath = path.join(this.config.guestPaths.asset, asset.filename); // TODO Add namespace for project.

                    const relativeExtractedAssetPath = buildJob.volumeName; // TODO Improve or use temp dir.
                    const absoluteExtractedAssetGuestPath = path.join(
                        buildJob.build.fullBuildPath,
                        relativeExtractedAssetPath,
                    );
                    const absoluteExtractedAssetHostPath = path.join(
                        buildJob.build.fullBuildHostPath,
                        relativeExtractedAssetPath,
                    ); // TODO Add namespace for project.

                    fs.mkdirSync(absoluteExtractedAssetGuestPath);

                    tar
                        .extract({
                            file: absoluteAssetGuestPath,
                            cwd: absoluteExtractedAssetGuestPath,
                        })
                        .then(() => {
                            execSync(
                                `docker volume create --name ${buildJob.volumeName}`,
                                {maxBuffer: BUFFER_SIZE},
                            );

                            execSync(
                                [
                                    `docker run --rm`,
                                    `-v ${absoluteExtractedAssetHostPath}:/source`,
                                    `-v ${buildJob.volumeName}:/target`,
                                    `alpine ash -c`,
                                    `"cp -av /source/* /target"`,
                                ].join(' '),
                                {maxBuffer: BUFFER_SIZE},
                            );

                            // TODO Remove extracted asset.

                            resolve();

                        });
                })
                .catch(() => {
                    reject();
                });
        });

    }

}
