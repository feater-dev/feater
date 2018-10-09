import * as _ from 'lodash';
import {Injectable} from '@nestjs/common';
import {JobLoggerFactory} from '../../logger/job-logger-factory';
import {InstanceRepository} from '../../persistence/repository/instance.repository';
import {InterpolationHelper} from '../interpolation-helper.component';
import {BuildJobInterface, JobInterface} from './job';
import {JobExecutorInterface} from './job-executor';

export class PrepareEnvVariablesJob implements BuildJobInterface {

    constructor(
        readonly build: any,
    ) {}

}

@Injectable()
export class PrepareEnvVariablesJobExecutor implements JobExecutorInterface{

    constructor(
        private readonly jobLoggerFactory: JobLoggerFactory,
        private readonly instanceRepository: InstanceRepository,
        private readonly interpolationHelper: InterpolationHelper,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof PrepareEnvVariablesJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const buildJob = job as PrepareEnvVariablesJob;
        const logger = this.jobLoggerFactory.createForBuildJob(buildJob);
        const { build } = buildJob;

        return new Promise(resolve => {
            logger.info('Setting environmental variables for build path and volume paths.');
            _.each(
                build.sources,
                (source, sourceId) => {
                    build.envVariables.add(`FEAT__BUILD_PATH__${sourceId.toUpperCase()}`, source.fullBuildPath);
                    build.envVariables.add(`FEAT__VOLUME_PATH__${sourceId.toUpperCase()}`, source.fullBuildHostPath);
                },
            );

            logger.info('Setting environmental variables for Feat variables.');
            _.each(
                build.featVariables,
                (value, name) => {
                    build.envVariables.add(`FEAT__${name.replace(/\./g, '__').toUpperCase()}`, value);
                },
            );

            logger.info('Setting environmental variables passed throuh build definition configuration.');
            _.each(
                build.config.envVariables,
                (envVariable) => {
                    build.envVariables.add(
                        envVariable.name,
                        this.interpolationHelper.interpolateText(envVariable.value, build),
                    );
                },
            );

            logger.debug(
                'Environmental variables set.',
                { envVariablesList: build.envVariables.toMap() },
            );

            logger.info('Persisting environmental variables.');
            this.instanceRepository
                .updateEnvVariables(build)
                .then(resolve);
        });
    }
}
