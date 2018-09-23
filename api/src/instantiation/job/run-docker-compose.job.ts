import * as _ from 'lodash';
import * as path from 'path';
import {spawn} from 'child_process';
import {Component} from '@nestjs/common';
import {EnvVariablesSet} from '../env-variables-set';
import {JobInterface, BuildJobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import * as split from 'split';
import {environment} from '../../environment/environment';

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

            commonEnvVariables.add('COMPOSE_PROJECT_NAME', `${environment.instantiation.containerNamePrefix}${build.hash}`);
            commonEnvVariables.add('COMPOSE_HTTP_TIMEOUT', `${environment.instantiation.composeHttpTimeout}`);

            const dockerCompose = spawn(
                environment.instantiation.composeBinaryPath,
                _.flatten(dockerComposeArgs),
                {
                    cwd: envDirAbsolutePath,
                    env: EnvVariablesSet.merge(
                        build.envVariables,
                        commonEnvVariables,
                    ).toMap(),
                },
            );

            dockerCompose.stdout
                .pipe(split())
                .on('data', line => {
                    logger.info(line);
                });

            dockerCompose.stderr
                .pipe(split())
                .on('data', line => {
                    logger.info(line.toString());
                });

            // TODO
            dockerCompose.on('error', error => {
                logger.error(error.message);
                reject(error);
            });

            // TODO
            dockerCompose.on('exit', code => {
                if (0 !== code) {
                    logger.error('Failed to run docker-compose.');
                    reject(code);

                    return;
                }

                resolve();
            });

            // TODO
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
