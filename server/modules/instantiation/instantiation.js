var _ = require('underscore');

module.exports = function (
    resolveReference,
    createDirectory,
    downloadSource,
    extractSource,
    copyBeforeBuildTask,
    interpolateBeforeBuildTask,
    prepareEnvironmentalVariables,
    prepareSummaryItems,
    parseDockerCompose,
    runDockerCompose,
    getContainerIds,
    connectContainersToNetwork,
    preparePortDomains,
    proxyPortDomains,
    executor
) {

    let { ResolveReferenceJob, ResolveReferenceJobExecutor } = resolveReference;
    let { CreateDirectoryJob, CreateDirectoryJobExecutor } = createDirectory;
    let { DownloadSourceJob, DownloadSourceJobExecutor } = downloadSource;
    let { ExtractSourceJob, ExtractSourceJobExecutor } = extractSource;
    let { CopyBeforeBuildTaskJob, CopyBeforeBuildTaskJobExecutor } = copyBeforeBuildTask;
    let { InterpolateBeforeBuildTaskJob, InterpolateBeforeBuildTaskJobExecutor } = interpolateBeforeBuildTask;
    let { PrepareEnvironmentalVariablesJob, PrepareEnvironmentalVariablesJobExecutor } = prepareEnvironmentalVariables;
    let { PrepareSummaryItemsJob, PrepareSummaryItemsJobExecutor } = prepareSummaryItems;
    let { ParseDockerComposeJob, ParseDockerComposeJobExecutor } = parseDockerCompose;
    let { RunDockerComposeJob, RunDockerComposeJobExecutor } = runDockerCompose;
    let { GetContainerIdsJob, GetContainerIdsJobExecutor } = getContainerIds;
    let { ConnectContainersToNetworkJob, ConnectContainersToNetworkJobExecutor } = connectContainersToNetwork;
    let { PreparePortDomainsJob, PreparePortDomainsJobExecutor } = preparePortDomains;
    let { ProxyPortDomainsJob, ProxyPortDomainsJobExecutor } = proxyPortDomains;

    let { JobExecutorCollection } = executor;

    let jobExecutorCollection = new JobExecutorCollection();

    jobExecutorCollection
        .add(new CreateDirectoryJobExecutor())
        .add(new PrepareEnvironmentalVariablesJobExecutor())
        .add(new PrepareSummaryItemsJobExecutor())
        .add(new ParseDockerComposeJobExecutor())
        .add(new RunDockerComposeJobExecutor())
        .add(new GetContainerIdsJobExecutor())
        .add(new ConnectContainersToNetworkJobExecutor())
        .add(new PreparePortDomainsJobExecutor())
        .add(new ProxyPortDomainsJobExecutor())
        .add(new ResolveReferenceJobExecutor())
        .add(new DownloadSourceJobExecutor())
        .add(new ExtractSourceJobExecutor())
        .add(new CopyBeforeBuildTaskJobExecutor())
        .add(new InterpolateBeforeBuildTaskJobExecutor());

    class JobsList {
        constructor() {
            this.stages = [];
        }

        addParallelStage(id, precedingStageIdPrefixes, jobs) {
            let index = 0;
            let jobId;
            for (let job of jobs) {
                jobId = `${id}_${index}`;
                this.stages.push({
                    id: jobId,
                    precedingStageIdPrefixes: extendedPrecedingStageIdPrefixes.slice(),
                    job
                });
                index += 1;
            }
        }
        
        addSequentialStage(id, precedingStageIdPrefixes, jobs) {
            let index = 0;
            let jobId;
            let extendedPrecedingStageIdPrefixes = precedingStageIdPrefixes.slice();
            for (let job of jobs) {
                jobId = `${id}_${index}`;
                this.stages.push({
                    id: jobId,
                    precedingStageIdPrefixes: extendedPrecedingStageIdPrefixes.slice(),
                    job
                });
                index += 1;
                extendedPrecedingStageIdPrefixes.push(jobId);
            }
        }

        run(jobExecutorCollection) {
            let resolutionsMap = {};
            let runningStageFlags = {};

            let notResolvedStageFlags = {};
            for (let stage of this.stages) {
                notResolvedStageFlags[stage.id] = true;
            }

            function isIdPrefixMatching(id, idPrefix) {
                return (
                    id.length >= idPrefix.length
                    && id.substr(0, idPrefix.length) === idPrefix
                );
            }

            return new Promise((resolve, reject) => {

                let tick = () => {
                    if (_.isEmpty(notResolvedStageFlags)) {
                        resolve(resolutionsMap);

                        return;
                    }

                    let noStageRunThisTick = true;
                    _.each(
                        this.stages,
                        stage => {
                            let {id, precedingStageIdPrefixes, job} = stage;

                            if (!notResolvedStageFlags[id]) {
                                return;
                            }

                            for (let precedingStageIdPrefix of precedingStageIdPrefixes) {
                                for (let notResolvedStageId in notResolvedStageFlags) {
                                    if (isIdPrefixMatching(notResolvedStageId, precedingStageIdPrefix)) {
                                        // Not able to run job, some required job is not resolved yet.

                                        return;
                                    }
                                }
                            }

                            noStageRunThisTick = false;
                            runningStageFlags[id] = true;

                            jobExecutorCollection
                                .getSupporting(job)
                                .execute(job, resolutionsMap)
                                .then(
                                    resolution => {
                                        resolutionsMap[id] = resolution;
                                        delete runningStageFlags[id];
                                        delete notResolvedStageFlags[id];
                                        setTimeout(tick, 0);
                                    },
                                    error => {
                                        reject(error);
                                    }
                                );
                        }
                    );

                    if (noStageRunThisTick && _.isEmpty(runningStageFlags)) {
                        reject(new Error('Inconsistent job dependencies.'));
                    }
                };

                setTimeout(tick, 0);
            });
        }
    }


    function mapBeforeBuildTaskToJob(beforeBuildTask, source) {
        switch (beforeBuildTask.type) {
            case 'copy':
                return new CopyBeforeBuildTaskJob(
                    source,
                    beforeBuildTask.sourceRelativePath,
                    beforeBuildTask.destinationRelativePath
                );

            case 'interpolate':
                return new InterpolateBeforeBuildTaskJob(
                    source,
                    beforeBuildTask.relativePath
                );

            default:
                throw new Error(`Unknown type of before build task ${beforeBuildTask.type} for source ${source.id}.`);
        }
    }

    function instantiateBuild(build) {
        let jobsList = new JobsList();

        jobsList.addSequentialStage('createDirectory', [], [new CreateDirectoryJob(build)]);

        for (let sourceId in build.sources) {
            let source = build.sources[sourceId];
            jobsList.addSequentialStage(`prepareSource_${sourceId}`, ['createDirectory'], [
                new ResolveReferenceJob(source),
                new DownloadSourceJob(source),
                new ExtractSourceJob(source)
            ]);
        }

        jobsList.addSequentialStage('parseCompose', ['prepareSource_'], [
            new ParseDockerComposeJob(build),
            new PreparePortDomainsJob(build)
        ]);

        let beforeBuildJobs = [];
        for (let sourceId in build.sources) {
            let source = build.sources[sourceId];
            for (let beforeBuildTask of source.config.beforeBuildTasks) {
                beforeBuildJobs.push(
                    mapBeforeBuildTaskToJob(beforeBuildTask, source)
                );
            }
        }
        jobsList.addSequentialStage('beforeBuildTasks', ['parseCompose'], beforeBuildJobs);

        jobsList.addSequentialStage('buildAndRun', ['beforeBuildTasks'], [
            new PrepareEnvironmentalVariablesJob(build),
            new PrepareSummaryItemsJob(build),
            new RunDockerComposeJob(build),
            new GetContainerIdsJob(build),
            new ConnectContainersToNetworkJob(build),
            new ProxyPortDomainsJob(build)
        ]);

        return jobsList.run(jobExecutorCollection);
    }

    return {
        instantiateBuild
    };

};
