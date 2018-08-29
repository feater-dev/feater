import {spawn} from 'child_process';
import {Component} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';
import {Build} from '../build';
import {EnvVariablesSet} from '../env-variables-set';
import * as _ from 'lodash';
import * as split from 'split';

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

export class ExecuteServiceCommandAfterBuildTaskJob implements BuildJobInterface {

    constructor(
        readonly build: Build,
        readonly serviceId: string,
        readonly customEnvVariables: [CustomEnvVariableInterface],
        readonly inheritedEnvVariables: [InheritedEnvVariableInterface],
        readonly command: [string],
    ) {}

}

@Component()
export class ExecuteServiceCommandAfterBuildTaskJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof ExecuteServiceCommandAfterBuildTaskJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as ExecuteServiceCommandAfterBuildTaskJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);

        return new Promise<any>((resolve, reject) => {

            const collectedEnvVariables = this.collectEnvVariables(buildJob);
            const matchedService = _.find(buildJob.build.services, (service) => service.id === buildJob.serviceId);
            let command = ['docker', 'exec'];
            for (const envVariable of collectedEnvVariables.toList()) {
                command = command.concat(['-e', `${envVariable.key}=${envVariable.value}`]);
            }
            command.push(matchedService.containerId);
            command = command.concat(buildJob.command);

            logger.info(`Executing service command '${command.join(' ')}' for service '${buildJob.serviceId}' with env variables ${collectedEnvVariables.toString()}.`);

            const serviceCommand = spawn(
                command[0],
                command.slice(1),
                {
                    cwd: buildJob.build.fullBuildPath,
                },
            );

            serviceCommand.stdout
                .pipe(split())
                .on('data', line => {
                    logger.info(line);
                });

            serviceCommand.stderr
                .pipe(split())
                .on('data', line => {
                    logger.info(line);
                });

            serviceCommand.on('error', error => {
                logger.error(`Failed to execute host command (error message: '${error.message}').`);
                reject(error);
            });

            const onCloseOrExit = code => {
                if (0 !== code) {
                    logger.error(`Failed to execute host command with code ${code}.`);
                    reject(code);

                    return;
                }
                resolve();
            };

            serviceCommand.on('close', onCloseOrExit);
            serviceCommand.on('exit', onCloseOrExit);
        });

    }

    protected collectEnvVariables(buildJob: ExecuteServiceCommandAfterBuildTaskJob): EnvVariablesSet {
        const collectedEnvVariables = new EnvVariablesSet();
        for (const customEnvVariable of buildJob.customEnvVariables) {
            collectedEnvVariables.add(customEnvVariable.name, customEnvVariable.value);
        }
        const buildEnvVariablesMap = buildJob.build.envVariables.toMap();
        for (const inheritedEnvVariable of buildJob.inheritedEnvVariables) {
            collectedEnvVariables.add(inheritedEnvVariable.alias || inheritedEnvVariable.name, buildEnvVariablesMap[inheritedEnvVariable.name]);
        }

        return collectedEnvVariables;
    }

}
