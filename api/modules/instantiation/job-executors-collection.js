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
    let { JobExecutorCollection } = executor;

    let jobExecutorCollection = new JobExecutorCollection();

    jobExecutorCollection
        .add(new resolveReference.ResolveReferenceJobExecutor())
        .add(new createDirectory.CreateDirectoryJobExecutor())
        .add(new downloadSource.DownloadSourceJobExecutor())
        .add(new extractSource.ExtractSourceJobExecutor())
        .add(new copyBeforeBuildTask.CopyBeforeBuildTaskJobExecutor())
        .add(new interpolateBeforeBuildTask.InterpolateBeforeBuildTaskJobExecutor())
        .add(new prepareEnvironmentalVariables.PrepareEnvironmentalVariablesJobExecutor())
        .add(new prepareSummaryItems.PrepareSummaryItemsJobExecutor())
        .add(new parseDockerCompose.ParseDockerComposeJobExecutor())
        .add(new runDockerCompose.RunDockerComposeJobExecutor())
        .add(new getContainerIds.GetContainerIdsJobExecutor())
        .add(new connectContainersToNetwork.ConnectContainersToNetworkJobExecutor())
        .add(new preparePortDomains.PreparePortDomainsJobExecutor())
        .add(new proxyPortDomains.ProxyPortDomainsJobExecutor());

    return jobExecutorCollection;
};
