import * as _ from 'lodash';
import * as path from 'path';
import {spawn} from 'child_process';
import {Component} from '@nestjs/common';
import {EnvironmentalVariablesSet} from '../environmental-variables-set';
import {JobInterface, BuildJobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {JobLoggerFactory} from '../../logger/job-logger-factory';

export class RunDockerComposeJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class RunDockerComposeJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof RunDockerComposeJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as RunDockerComposeJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);
        const { build } = buildJob;

        return new Promise((resolve, reject) => {
            logger.info('Running docker-compose.');

            const dockerComposeDirectoryAbsolutePath = path.join(
                build.sources[build.config.composeFile.sourceId].fullBuildPath,
                path.dirname(build.config.composeFile.relativePath),
            );

            const dockerComposeFileName = path.basename(build.config.composeFile.relativePath);

            const commonEnvironmentalVariables = new EnvironmentalVariablesSet();
            // TODO Move pattern to config. Move value to build class.
            commonEnvironmentalVariables.add('COMPOSE_PROJECT_NAME', `featbuild${build.hash}`);
            // TODO Move to config.
            commonEnvironmentalVariables.add('COMPOSE_HTTP_TIMEOUT', '5000');
            // TODO Move to config.
            commonEnvironmentalVariables.add('PATH', '/usr/local/bin/');

            const dockerCompose = spawn(
                'docker-compose', ['--file', dockerComposeFileName, 'up', '-d', '--no-color'],
                {
                    cwd: dockerComposeDirectoryAbsolutePath,
                    env: EnvironmentalVariablesSet.merge(
                        build.environmentalVariables,
                        commonEnvironmentalVariables,
                    ).toMap(),
                },
            );

            dockerCompose.stdout.on('data', stdoutData => {
                logger.info(stdoutData.toString());
            });

            dockerCompose.stderr.on('data', stderrData => {
                logger.info(stderrData.toString());
            });

            dockerCompose.on('error', error => {
                logger.error(_.toLocaleString(error));
                reject(error);
            });

            dockerCompose.on('exit', code => {
                if (0 !== code) {
                    logger.error('Failed to run docker-compose.');
                    reject(code);

                    return;
                }

                resolve();
            });

            dockerCompose.on('close', code => {
                if (0 !== code) {
                    logger.error('Failed to run docker-compose.');
                    reject(code);

                    return;
                }

                resolve();
            });
        });

    }

}
