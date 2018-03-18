import * as path from 'path';
import { spawn } from 'child_process';
import { Component } from '@nestjs/common';
import { EnvironmentalVariablesSet } from '../environmental-variables-set';
import { JobInterface, BuildJobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

export class RunDockerComposeJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class RunDockerComposeJobExecutor implements JobExecutorInterface {

    supports(job: JobInterface): boolean {
        return (job instanceof RunDockerComposeJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as RunDockerComposeJob;
        const { build } = buildJob;

        return new Promise((resolve, reject) => {
            console.log('Running docker-compose.');

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

            // let stdoutLogger = build.logger.createNested('compose stdout', { splitLines: true });
            dockerCompose.stdout.on('data', stdoutData => {
                console.log(stdoutData.toString());
                // stdoutLogger.debug(stdoutData.toString());
            });

            // let stderrLogger = build.logger.createNested('compose stderr', { splitLines: true });
            dockerCompose.stderr.on('data', stderrData => {
                console.log(stderrData.toString());
                // stderrLogger.error(stderrData.toString());
            });

            dockerCompose.on('error', error => {
                console.log(error);
                reject(error);
            });

            dockerCompose.on('exit', code => {
                if (0 !== code) {
                    console.log('Failed to run docker-compose.');
                    reject(code);

                    return;
                }

                resolve();
            });

            dockerCompose.on('close', code => {
                if (0 !== code) {
                    console.log('Failed to run docker-compose.');
                    reject(code);

                    return;
                }

                resolve();
            });
        });

    }

}
