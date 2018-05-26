import * as _ from 'lodash';
import {Component} from '@nestjs/common';
import {Config} from '../../config/config.component';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {BuildInstanceRepository} from '../../persistence/repository/build-instance.repository';
import {InterpolationHelper} from '../interpolation-helper.component';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';

export class PrepareEnvironmentalVariablesJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Component()
export class PrepareEnvironmentalVariablesJobExecutor implements JobExecutorInterface{

    constructor(
        private readonly config: Config,
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly buildInstanceRepository: BuildInstanceRepository,
        private readonly interpolationHelper: InterpolationHelper,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof PrepareEnvironmentalVariablesJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as PrepareEnvironmentalVariablesJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);
        const { build } = buildJob;

        return new Promise(resolve => {
            logger.info('Setting environmental variables for build path and volume paths.');
            _.each(
                build.sources,
                (source, sourceId) => {
                    build.environmentalVariables.add(`FEAT__BUILD_PATH__${sourceId.toUpperCase()}`, source.fullBuildPath);
                    build.environmentalVariables.add(`FEAT__VOLUME_PATH__${sourceId.toUpperCase()}`, source.fullBuildHostPath);
                },
            );

            logger.info('Setting environmental variables for Feat variables.');
            _.each(
                build.featVariables,
                (value, name) => {
                    build.environmentalVariables.add(`FEAT__${name.replace(/\./g, '__').toUpperCase()}`, value);
                },
            );

            logger.info('Setting environmental variables passed throuh build definition configuration.');
            _.each(
                build.config.environmentalVariables,
                (value, name) => {
                    build.environmentalVariables.add(
                        name,
                        this.interpolationHelper.interpolateText(value, build.featVariables),
                    );
                },
            );

            logger.debug(
                'Environmental variables set.',
                { environmentalVariablesList: JSON.stringify(build.environmentalVariables.toMap()) },
            );

            logger.info('Persisting environmental variables.');
            this.buildInstanceRepository
                .updateEnvironmentalVariables(build)
                .then(resolve);
        });
    }
}
