import * as path from 'path';
import * as fs from 'fs-extra';
import {execSync} from 'child_process';
import {spawn} from 'child_process';
import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {BuildJobInterface, JobInterface, SourceJobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {Build} from '../build';
import {EnvVariablesSet} from '../env-variables-set';
import * as _ from 'lodash';

const BUFFER_SIZE = 1048576; // 1M

// TODO Maybe move to separate file.
export interface CustomEnvVariableInterface {
    readonly name: string;
    readonly value: string;
}

// TODO Maybe move to separate file.
export interface InheritedEnvVariableInterface {
    readonly name: string;
    readonly alias: string;
}

export class ExecuteHostCommandAfterBuildTaskJob implements BuildJobInterface {

    constructor(
        readonly build: Build,
        readonly customEnvVariables: [CustomEnvVariableInterface],
        readonly inheritedEnvVariables: [InheritedEnvVariableInterface],
        readonly command: [string],
    ) {}

}

@Component()
export class ExecuteHostCommandAfterBuildTaskJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof ExecuteHostCommandAfterBuildTaskJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as ExecuteHostCommandAfterBuildTaskJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);

        return new Promise<any>((resolve, reject) => {

            const collectedEnvVariables = this.collectEnvVariables(buildJob);

            logger.info(`Executing host command '${buildJob.command.join(' ')}' with env variables ${collectedEnvVariables.toString()}.`);

            const hostCommand = spawn(
                buildJob.command[0],
                buildJob.command.slice(1),
                {
                    cwd: buildJob.build.fullBuildPath,
                    env: collectedEnvVariables.toMap(),
                },
            );

            hostCommand.stdout.on('data', stdoutData => {
                logger.info(stdoutData.toString());
            });

            hostCommand.stderr.on('data', stderrData => {
                logger.info(stderrData.toString());
            });

            hostCommand.on('error', error => {
                logger.error(error.message);
                reject(error);
            });

            hostCommand.on('exit', code => {
                if (0 !== code) {
                    logger.error('Failed to execute host command.');
                    reject(code);

                    return;
                }

                resolve();
            });

            hostCommand.on('close', code => {
                if (0 !== code) {
                    logger.error('Failed to execute host command.');
                    reject(code);

                    return;
                }

                resolve();
            });

        });

    }

    protected collectEnvVariables(buildJob: ExecuteHostCommandAfterBuildTaskJob): EnvVariablesSet {
        const collectedEnvVariables = new EnvVariablesSet();
        for (const customEnvVariable of buildJob.customEnvVariables) {
            collectedEnvVariables.add(customEnvVariable.name, customEnvVariable.value);
        }
        const buildEnvVariablesMap = buildJob.build.envVariables.toMap();
        for (const inheritedEnvVariable of buildJob.inheritedEnvVariables) {
            collectedEnvVariables.add(inheritedEnvVariable.alias, buildEnvVariablesMap[inheritedEnvVariable.name]);
        }

        return collectedEnvVariables;
    }

}
