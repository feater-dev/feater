var _ = require('underscore');

module.exports = function (
    resolveReference,
    createDirectory,
    downloadArchive,
    extractArchive,
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
    executor,
    runners
) {

    var { ResolveReferenceJob, ResolveReferenceJobExecutor } = resolveReference;
    var { CreateDirectoryJob, CreateDirectoryJobExecutor } = createDirectory;
    var { DownloadArchiveJob, DownloadArchiveJobExecutor } = downloadArchive;
    var { ExtractArchiveJob, ExtractArchiveJobExecutor } = extractArchive;
    var { CopyBeforeBuildTaskJob, CopyBeforeBuildTaskJobExecutor } = copyBeforeBuildTask;
    var { InterpolateBeforeBuildTaskJob, InterpolateBeforeBuildTaskJobExecutor } = interpolateBeforeBuildTask;
    var { PrepareEnvironmentalVariablesJob, PrepareEnvironmentalVariablesJobExecutor } = prepareEnvironmentalVariables;
    var { PrepareSummaryItemsJob, PrepareSummaryItemsJobExecutor } = prepareSummaryItems;
    var { ParseDockerComposeJob, ParseDockerComposeJobExecutor } = parseDockerCompose;
    var { RunDockerComposeJob, RunDockerComposeJobExecutor } = runDockerCompose;
    var { GetContainerIdsJob, GetContainerIdsJobExecutor } = getContainerIds;
    var { ConnectContainersToNetworkJob, ConnectContainersToNetworkJobExecutor } = connectContainersToNetwork;
    var { PreparePortDomainsJob, PreparePortDomainsJobExecutor } = preparePortDomains;
    var { ProxyPortDomainsJob, ProxyPortDomainsJobExecutor } = proxyPortDomains;

    var { JobExecutorCollection } = executor;

    var { PromiseRunner, JobRunner } = runners;

    function createJobExecutorCollection() {
        var jobExecutorCollection = new JobExecutorCollection();

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
            .add(new DownloadArchiveJobExecutor())
            .add(new ExtractArchiveJobExecutor())
            .add(new CopyBeforeBuildTaskJobExecutor())
            .add(new InterpolateBeforeBuildTaskJobExecutor());

        return jobExecutorCollection;
    }

    function startBuildInstance(buildInstance) {
        let jobExecutorCollection = createJobExecutorCollection();
        let stages = [];

        stages.push({
            jobRunners: [
                new JobRunner(jobExecutorCollection, [
                    new CreateDirectoryJob(buildInstance)
                ])
            ]
        });

        stages.push({
            jobRunners: _.map(
                buildInstance.componentInstances,
                componentInstance => {
                    return new JobRunner(jobExecutorCollection, [
                        new ResolveReferenceJob(componentInstance),
                        new DownloadArchiveJob(componentInstance),
                        new ExtractArchiveJob(componentInstance)
                    ]);
                }
            )
        });

        stages.push({
            jobRunners: [
                new JobRunner(jobExecutorCollection, [
                    new ParseDockerComposeJob(buildInstance),
                    new PreparePortDomainsJob(buildInstance)
                ])
            ]
        });

        function mapBeforeBuildTaskToJob(beforeBuildTask, componentInstance) {
            switch (beforeBuildTask.type) {
                case 'copy':
                    return new CopyBeforeBuildTaskJob(
                        componentInstance,
                        beforeBuildTask.sourceRelativePath,
                        beforeBuildTask.destinationRelativePath
                    );

                case 'interpolate':
                    return new InterpolateBeforeBuildTaskJob(
                        componentInstance,
                        beforeBuildTask.relativePath
                    );

                default:
                    throw new Error(`Unknown type of before build task ${beforeBuildTask.type} for component ${componentInstance.id}.`);
            }
        }

        stages.push({
            jobRunners: _.map(
                buildInstance.componentInstances,
                componentInstance => {
                    return new JobRunner(
                        jobExecutorCollection,
                        _.map(
                            componentInstance.config.beforeBuildTasks,
                            beforeBuildTask => mapBeforeBuildTaskToJob(beforeBuildTask, componentInstance)
                        )
                    );
                }
            )
        });

        stages.push({
            jobRunners: [
                new JobRunner(jobExecutorCollection, [
                    new PrepareEnvironmentalVariablesJob(buildInstance),
                    new PrepareSummaryItemsJob(buildInstance),
                    new RunDockerComposeJob(buildInstance),
                    new GetContainerIdsJob(buildInstance),
                    new ConnectContainersToNetworkJob(buildInstance),
                    new ProxyPortDomainsJob(buildInstance)
                ])
            ]
        });
        
        function createStagePromiseRunner({ jobRunners }) {
            return new PromiseRunner(
                _.map(jobRunners, jobRunner => {
                    return () => {
                        return jobRunner.runInSequence();
                    };
                })
            );
        }
        
        let buildInstancePromiseRunner = new PromiseRunner(
            _.map(stages, stage => {
                return () => {
                    return createStagePromiseRunner(stage).runInParallel();
                };
            })
        );

        return buildInstancePromiseRunner.runInSequence();
    }

    return {
        startBuildInstance
    };

};
