import * as _ from 'lodash';
import {Component} from '@nestjs/common';
import {Config} from '../config/config.component';
import {StagesListFactory} from './stages-list-factory.component';
import {Build} from './build';
import {Source} from './source';
import {JobInterface} from './job/job';
import {CopyBeforeBuildTaskJob} from './job/copy-before-build-task.job';
import {InterpolateBeforeBuildTaskJob} from './job/interpolate-before-build-task.job';
import {CreateDirectoryJob} from './job/create-directory.job';
import {CloneSourceJob} from './job/clone-source.job';
import {ParseDockerComposeJob} from './job/parse-docker-compose.job';
import {PreparePortDomainsJob} from './job/prepare-port-domains.job';
import {PrepareEnvVariablesJob} from './job/prepare-env-variables.job';
import {PrepareSummaryItemsJob} from './job/prepare-summary-items.job';
import {RunDockerComposeJob} from './job/run-docker-compose.job';
import {GetContainerIdsJob} from './job/get-container-ids.job';
import {ConnectContainersToNetworkJob} from './job/connect-containers-to-network-job';
import {ProxyPortDomainsJob} from './job/proxy-port-domains.job';
import {BaseLogger} from '../logger/base-logger';
import {ExecuteHostCommandAfterBuildTaskJob} from './job/execute-host-command-after-build-task.job';
import {ExecuteServiceCommandAfterBuildTaskJob} from './job/execute-service-command-after-build-task.job';
import {CopyAssetIntoContainerAfterBuildTaskJob} from './job/copy-asset-into-container-after-build-task.job';
import {CreateVolumeFromAssetAfterBuildTaskJob} from './job/create-volume-from-asset-after-build-task.job';

@Component()
export class Instantiator {

    constructor(
        private readonly config: Config,
        private readonly logger: BaseLogger,
        private readonly stagesListFactory: StagesListFactory,
    ) {}

    createBuild(id: string, hash: string, definition: any) {
        this.logger.info('Setting up build and sources.');
        const {config: definitionConfig} = definition.toObject();
        const build = new Build(id, hash, definitionConfig);
        for (const source of definitionConfig.sources) {
            new Source(source.id, build, source);
        }

        this.logger.info('Setting basic Feat variables.');
        build.addFeatVariable('scheme', this.config.app.scheme);
        build.addFeatVariable('host', this.config.app.host);
        build.addFeatVariable('npm_cache', this.config.hostPaths.npmCache);
        build.addFeatVariable('composer_cache', this.config.hostPaths.composerCache);
        build.addFeatVariable('instance_id', build.id);
        build.addFeatVariable('instance_hash', build.hash);

        return build;
    }

    instantiateBuild(build: Build): Promise<any> {
        const stagesList = this.stagesListFactory.create();

        stagesList.addSequentialStage('createDirectory', [], [new CreateDirectoryJob(build)]);

        for (const sourceId of Object.keys(build.sources)) {
            const source = build.sources[sourceId];
            stagesList.addSequentialStage(`prepareSource_${sourceId}`, ['createDirectory'], [
                new CloneSourceJob(source),
            ]);
        }

        stagesList.addSequentialStage('parseCompose', ['prepareSource_'], [
            new ParseDockerComposeJob(build),
            new PreparePortDomainsJob(build),
        ]);

        // Here we could save build to Mongo. All sources and services are ready. All paths are set.

        const beforeBuildJobs = [];
        for (const sourceId of Object.keys(build.sources)) {
            const source = build.sources[sourceId];
            for (const beforeBuildTask of source.config.beforeBuildTasks) {
                beforeBuildJobs.push(this.mapBeforeBuildTaskToJob(beforeBuildTask, source));
            }
        }
        stagesList.addSequentialStage('beforeBuildTasks', ['parseCompose'], beforeBuildJobs);

        stagesList.addSequentialStage('buildAndRun', ['beforeBuildTasks'], [
            new PrepareEnvVariablesJob(build),
            new PrepareSummaryItemsJob(build),
            new RunDockerComposeJob(build),
            new GetContainerIdsJob(build),
            new ConnectContainersToNetworkJob(build),
            new ProxyPortDomainsJob(build),
        ]);

        const afterBuildJobs = [];
        for (const afterBuildTask of build.config.afterBuildTasks) {
            afterBuildJobs.push(this.mapAfterBuildTaskToJob(afterBuildTask, build));
        }
        stagesList.addSequentialStage('executeAfterBuildTasks', ['buildAndRun'], afterBuildJobs);

        // Or maybe we should only save here?

        return stagesList
            .execute()
            .then(
                () => {
                    this.logger.info('Build instantiated and started.');
                },
                error => {
                    this.logger.error('Failed to instantiate and start build.', {error: _.toString(error)});
                },
            );
    }

    private mapBeforeBuildTaskToJob(beforeBuildTask: any, source: Source): JobInterface {
        switch (beforeBuildTask.type) {
            case 'copy':
                return new CopyBeforeBuildTaskJob(
                    source,
                    beforeBuildTask.sourceRelativePath,
                    beforeBuildTask.destinationRelativePath,
                );

            case 'interpolate':
                return new InterpolateBeforeBuildTaskJob(
                    source,
                    beforeBuildTask.relativePath,
                );

            default:
                throw new Error(`Unknown type of before build task ${beforeBuildTask.type} for source ${source.id}.`);
        }
    }

    private mapAfterBuildTaskToJob(afterBuildTask: any, build: Build): JobInterface {
        switch (afterBuildTask.type) {
            case 'executeHostCommand':
                return new ExecuteHostCommandAfterBuildTaskJob(
                    build,
                    afterBuildTask.customEnvVariables,
                    afterBuildTask.inheritedEnvVariables,
                    afterBuildTask.command,
                );

            case 'executeServiceCommand':
                return new ExecuteServiceCommandAfterBuildTaskJob(
                    build,
                    afterBuildTask.serviceId,
                    afterBuildTask.customEnvVariables,
                    afterBuildTask.inheritedEnvVariables,
                    afterBuildTask.command,
                );

            case 'copyAssetIntoContainer':
                return new CopyAssetIntoContainerAfterBuildTaskJob(
                    build,
                    afterBuildTask.serviceId,
                    afterBuildTask.assetId,
                    afterBuildTask.destinationPath,
                );

            case 'createVolumeFromAsset':
                return new CreateVolumeFromAssetAfterBuildTaskJob(
                    build,
                    afterBuildTask.assetId,
                    afterBuildTask.volumeName,
                );

            default:
                throw new Error(`Unknown type of after build task ${afterBuildTask.type} for build ${build.id}.`);
        }
    }

}
