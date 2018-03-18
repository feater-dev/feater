import * as _ from 'lodash';
import { Component } from '@nestjs/common';
import { Config } from '../config/config.component';
import { StagesListFactory } from './stages-list-factory.component';
import { Build } from './build';
import { Source } from './source';
import { JobInterface } from './job/job';
import { CopyBeforeBuildTaskJob } from './job/copy-before-build-task.job';
import { InterpolateBeforeBuildTaskJob } from './job/interpolate-before-build-task.job';
import { CreateDirectoryJob } from './job/create-directory.job';
import { ResolveReferenceJob } from './job/resolve-reference.job';
import { DownloadSourceJob } from './job/download-source.job';
import { ExtractSourceJob } from './job/extract-source.job';
import { ParseDockerComposeJob } from './job/parse-docker-compose.job';
import { PreparePortDomainsJob } from './job/prepare-port-domains.job';
import { PrepareEnvironmentalVariablesJob } from './job/prepare-environmental-variables.job';
import { PrepareSummaryItemsJob } from './job/prepare-summary-items.job';
import { RunDockerComposeJob } from './job/run-docker-compose.job';
import { GetContainerIdsJob } from './job/get-container-ids.job';
import { ConnectContainersToNetworkJob } from './job/connect-containers-to-network-job';
import { ProxyPortDomainsJob } from './job/proxy-port-domains.job';

@Component()
export class Instantiator {

    constructor(
        private readonly config: Config,
        private readonly stagesListFactory: StagesListFactory,
    ) {}

    createBuild(id: string, hash: string, buildDefinition: any) {
        console.log('Setting up build.');
        const buildDefinitionConfig = buildDefinition._doc.config;
        const build = new Build(id, hash, buildDefinitionConfig);

        console.log('Setting up sources.');
        _.map(_.keys(buildDefinitionConfig.sources), sourceId => {
            new Source(sourceId, build, buildDefinitionConfig.sources[sourceId]);
        });

        console.log('Setting basic Feat variables.');
        const featVariables = {
            scheme: this.config.app.scheme,
            host: this.config.app.host,
            port: this.config.app.port,
            npm_cache: this.config.hostPaths.npmCache,
            composer_cache: this.config.hostPaths.composerCache,
        };

        _.each(featVariables, (value, name) => {
            build.addFeatVariable(name, value);
        });

        return build;
    }

    instantiateBuild(build: Build): Promise<any> {
        const stagesList = this.stagesListFactory.create();

        stagesList.addSequentialStage('createDirectory', [], [new CreateDirectoryJob(build)]);

        for (const sourceId of Object.keys(build.sources)) {
            const source = build.sources[sourceId];
            stagesList.addSequentialStage(`prepareSource_${sourceId}`, ['createDirectory'], [
                new ResolveReferenceJob(source),
                new DownloadSourceJob(source),
                new ExtractSourceJob(source),
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
            new PrepareEnvironmentalVariablesJob(build),
            new PrepareSummaryItemsJob(build),
            new RunDockerComposeJob(build),
            new GetContainerIdsJob(build),
            new ConnectContainersToNetworkJob(build),
            new ProxyPortDomainsJob(build),
        ]);

        // Or maybe we should only save here?

        return stagesList
            .execute()
            .then(
                () => {
                    console.log('Build instantiated and started.');
                },
                error => {
                    console.log('Failed to instantiate and start build.');
                    console.log(error);
                },
            );
    }

    private mapBeforeBuildTaskToJob(
        beforeBuildTask: any,
        source: Source,
    ): JobInterface {
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

}
