import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {InstanceRepository} from '../../persistence/repository/instance.repository';
import {JobInterface, BuildJobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {Config} from '../../config/config.component';

export class ParseDockerComposeJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class ParseDockerComposeJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly config: Config,
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly instanceRepository: InstanceRepository,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof ParseDockerComposeJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as ParseDockerComposeJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);
        const { build } = buildJob;

        return new Promise(resolve => {
            logger.info('Parsing compose file.');

            const composeFile = build.config.composeFiles[0]; // TODO Handle multiple compose files.
            const fullBuildPath = build.sources[composeFile.sourceId].fullBuildPath;

            build.composeProjectName = `${this.config.instantiation.containerNamePrefix}${build.hash}`;
            build.services = {};

            for (const composeFileRelativePath of composeFile.composeFileRelativePaths) {
                const composeFileAbsolutePath = path.join(fullBuildPath, composeFileRelativePath);
                const compose = jsYaml.safeLoad(
                    fs.readFileSync(composeFileAbsolutePath).toString(),
                );

                logger.debug('Compose file parsed to Yaml.', {composeFileAbsolutePath, compose: JSON.stringify(compose)});

                for (const serviceId of Object.keys(compose.services)) {
                    if (build.services[serviceId]) {
                        continue;
                    }
                    build.services[serviceId] = {
                        id: serviceId,
                        cleanId: serviceId.replace(/[^a-zA-Z\d-]/g, '-').toLowerCase(),
                        containerNamePrefix: `${build.composeProjectName}_${serviceId}`,
                        proxiedPorts: [],
                    };
                }
            }

            logger.debug('Services found in compose file.', {services: JSON.stringify(build.services)});

            this.instanceRepository.updateServices(build);

            resolve();

        });
    }

}
