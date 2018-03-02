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
    executor,
    runners
) {

    var { ResolveReferenceJob, ResolveReferenceJobExecutor } = resolveReference;
    var { CreateDirectoryJob, CreateDirectoryJobExecutor } = createDirectory;
    var { DownloadSourceJob, DownloadSourceJobExecutor } = downloadSource;
    var { ExtractSourceJob, ExtractSourceJobExecutor } = extractSource;
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
            .add(new DownloadSourceJobExecutor())
            .add(new ExtractSourceJobExecutor())
            .add(new CopyBeforeBuildTaskJobExecutor())
            .add(new InterpolateBeforeBuildTaskJobExecutor());

        return jobExecutorCollection;
    }

    function instantiateBuild(build) {
        let jobExecutorCollection = createJobExecutorCollection();
        let stages = [];

        stages.push({
            jobRunners: [
                new JobRunner(jobExecutorCollection, [
                    new CreateDirectoryJob(build)
                ])
            ]
        });

        stages.push({
            jobRunners: _.map(
                build.sources,
                source => {
                    return new JobRunner(jobExecutorCollection, [
                        new ResolveReferenceJob(source),
                        new DownloadSourceJob(source),
                        new ExtractSourceJob(source)
                    ]);
                }
            )
        });

        stages.push({
            jobRunners: [
                new JobRunner(jobExecutorCollection, [
                    new ParseDockerComposeJob(build),
                    new PreparePortDomainsJob(build)
                ])
            ]
        });

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

        stages.push({
            jobRunners: _.map(
                build.sources,
                source => {
                    return new JobRunner(
                        jobExecutorCollection,
                        _.map(
                            source.config.beforeBuildTasks,
                            beforeBuildTask => mapBeforeBuildTaskToJob(beforeBuildTask, source)
                        )
                    );
                }
            )
        });

        stages.push({
            jobRunners: [
                new JobRunner(jobExecutorCollection, [
                    new PrepareEnvironmentalVariablesJob(build),
                    new PrepareSummaryItemsJob(build),
                    new RunDockerComposeJob(build),
                    new GetContainerIdsJob(build),
                    new ConnectContainersToNetworkJob(build),
                    new ProxyPortDomainsJob(build)
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
        
        let buildPromiseRunner = new PromiseRunner(
            _.map(stages, stage => {
                return () => {
                    return createStagePromiseRunner(stage).runInParallel();
                };
            })
        );

        return buildPromiseRunner.runInSequence();
    }

    return {
        instantiateBuild
    };

};
