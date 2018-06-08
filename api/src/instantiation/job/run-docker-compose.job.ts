import * as _ from 'lodash';
import * as path from 'path';
import {spawn} from 'child_process';
import {Component} from '@nestjs/common';
import {EnvVariablesSet} from '../env-variables-set';
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

            const composeFile = build.config.composeFiles[0]; // TODO Handle multiple compose files.
            const fullBuildPath = build.sources[composeFile.sourceId].fullBuildPath;

            const envDirAbsolutePath = path.join(fullBuildPath, composeFile.envDirRelativePath);

            const dockerComposeArgs = [];
            for (const composeFileRelativePath of composeFile.composeFileRelativePaths) {
                const composeFileAbsolutePath = path.join(fullBuildPath, composeFileRelativePath);
                dockerComposeArgs.push(['--file', path.relative(envDirAbsolutePath, composeFileAbsolutePath)]);
            }
            dockerComposeArgs.push(['up', '-d', '--no-color']);

            const commonEnvVariables = new EnvVariablesSet();

            // TODO Move pattern to config. Move value to build class.
            commonEnvVariables.add('COMPOSE_PROJECT_NAME', `featbuild${build.hash}`);
            // TODO Move to config.
            commonEnvVariables.add('COMPOSE_HTTP_TIMEOUT', '5000');
            // TODO Move to config.
            commonEnvVariables.add('PATH', '/usr/local/bin/');

            const dockerCompose = spawn(
                'docker-compose',
                _.flatten(dockerComposeArgs),
                {
                    cwd: envDirAbsolutePath,
                    env: EnvVariablesSet.merge(
                        build.envVariables,
                        commonEnvVariables,
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
                logger.error(error.message);
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
