var _ = require('underscore');

module.exports = function (
    jobExecutorsCollection,
    JobsList,
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
    proxyPortDomains
) {

    let { ResolveReferenceJob } = resolveReference;
    let { CreateDirectoryJob } = createDirectory;
    let { DownloadSourceJob } = downloadSource;
    let { ExtractSourceJob } = extractSource;
    let { CopyBeforeBuildTaskJob } = copyBeforeBuildTask;
    let { InterpolateBeforeBuildTaskJob } = interpolateBeforeBuildTask;
    let { PrepareEnvironmentalVariablesJob } = prepareEnvironmentalVariables;
    let { PrepareSummaryItemsJob } = prepareSummaryItems;
    let { ParseDockerComposeJob } = parseDockerCompose;
    let { RunDockerComposeJob } = runDockerCompose;
    let { GetContainerIdsJob } = getContainerIds;
    let { ConnectContainersToNetworkJob } = connectContainersToNetwork;
    let { PreparePortDomainsJob } = preparePortDomains;
    let { ProxyPortDomainsJob } = proxyPortDomains;

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

        // Here we could save build to Mongo. All sources and services are ready. All paths are set.

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

        // Or maybe we should only save here?

        return jobsList.run(jobExecutorsCollection);
    }

    return {
        instantiateBuild
    };

};
