var _ = require('underscore');
var path = require('path');
var fs = require('fs-extra');
var Promise = require('bluebird');
var { exec, spawn } = require('child_process');

module.exports = function (
    resolveReference,
    createDirectory,
    downloadArchive,
    extractArchive,
    providePort,
    copyBeforeBuildTask,
    interpolateBeforeBuildTask,
    prepareEnvironmentalVariables,
    prepareSummaryItems,
    runDockerCompose,
    executor
) {

    var {ResolveReferenceJob, ResolveReferenceJobExecutor} = resolveReference;
    var {CreateDirectoryJob, CreateDirectoryJobExecutor} = createDirectory;
    var {DownloadArchiveJob, DownloadArchiveJobExecutor} = downloadArchive;
    var {ExtractArchiveJob, ExtractArchiveJobExecutor} = extractArchive;
    var {ProvidePortJob, ProvidePortJobExecutor} = providePort;
    var {CopyBeforeBuildTaskJob, CopyBeforeBuildTaskJobExecutor} = copyBeforeBuildTask;
    var {InterpolateBeforeBuildTaskJob, InterpolateBeforeBuildTaskJobExecutor} = interpolateBeforeBuildTask;
    var {PrepareEnvironmentalVariablesJob, PrepareEnvironmentalVariablesJobExecutor} = prepareEnvironmentalVariables;
    var {PrepareSummaryItemsJob, PrepareSummaryItemsJobExecutor} = prepareSummaryItems;
    var {RunDockerComposeJob, RunDockerComposeJobExecutor} = runDockerCompose;

    var {JobExecutorCollection, DependantJobsExecutor} = executor;

    function createJobExecutorCollection() {
        var jobExecutorCollection = new JobExecutorCollection();

        jobExecutorCollection
            .add(new CreateDirectoryJobExecutor())
            .add(new ProvidePortJobExecutor())
            .add(new PrepareEnvironmentalVariablesJobExecutor())
            .add(new PrepareSummaryItemsJobExecutor())
            .add(new RunDockerComposeJobExecutor())
            .add(new ResolveReferenceJobExecutor())
            .add(new DownloadArchiveJobExecutor())
            .add(new ExtractArchiveJobExecutor())
            .add(new CopyBeforeBuildTaskJobExecutor())
            .add(new InterpolateBeforeBuildTaskJobExecutor());

        return jobExecutorCollection;
    }

    function createBuildInstanceDependantJobsExecutor(buildInstance) {
        var dependantJobsExecutor = new DependantJobsExecutor(createJobExecutorCollection());

        var resolveReferenceJobs = _.map(
            buildInstance.componentInstances,
            (componentInstance) => {
                var job = new ResolveReferenceJob(componentInstance);
                dependantJobsExecutor.add(job);

                return job;
            }
        );

        var createDirectoryJob = new CreateDirectoryJob(buildInstance);
        dependantJobsExecutor.add(createDirectoryJob, resolveReferenceJobs);

        var extractArchiveJobs = [];
        _.each(
            buildInstance.componentInstances,
            (componentInstance) => {
                var downloadArchiveJob = new DownloadArchiveJob(componentInstance);
                var extractArchiveJob = new ExtractArchiveJob(componentInstance);
                dependantJobsExecutor.add(downloadArchiveJob, [createDirectoryJob]);
                dependantJobsExecutor.add(extractArchiveJob, [downloadArchiveJob]);
                extractArchiveJobs.push(extractArchiveJob);
            }
        );

        var previousJobs = extractArchiveJobs;

        if (buildInstance.config.externalPorts.length) {
            var providePortJobs = _.map(
                buildInstance.config.externalPorts,
                ({ranges: portRanges}, portName) => {
                    var job = new ProvidePortJob(buildInstance, portName, portRanges);
                    dependantJobsExecutor.add(job, extractArchiveJobs);

                    return job;
                }
            );
            previousJobs = providePortJobs;
        }

        var componentIdToBeforeBuildTaskJobsMap = {};
        _.each(
            buildInstance.componentInstances,
            (componentInstance, componentId) => {
                componentIdToBeforeBuildTaskJobsMap[componentId] = [];
                _.each(
                    componentInstance.config.beforeBuildTasks,
                    (beforeBuildEntry) => {
                        var job;

                        switch (beforeBuildEntry.type) {
                            case 'copy':
                                job = new CopyBeforeBuildTaskJob(componentInstance, beforeBuildEntry.sourceRelativePath, beforeBuildEntry.destinationRelativePath);
                                break;

                            case 'interpolate':
                                job = new InterpolateBeforeBuildTaskJob(componentInstance, beforeBuildEntry.relativePath);
                                break;

                            default:
                                throw new Error(`Unknown type of before build task ${beforeBuildEntry.type} for component ${componentId}.`);
                        }

                        dependantJobsExecutor.add(
                            job,
                            previousJobs.concat(componentIdToBeforeBuildTaskJobsMap[componentId].slice(-1))
                        );
                        componentIdToBeforeBuildTaskJobsMap[componentId].push(job);
                    }
                );
            }
        );

        var lastBeforeBuildTaskJobs = [];
        _.map(
            buildInstance.componentInstances,
            (componentInstance, componentId) => {
                lastBeforeBuildTaskJobs = lastBeforeBuildTaskJobs.concat(componentIdToBeforeBuildTaskJobsMap[componentId].slice(-1));
            }
        );

        var prepareEnvironmentalVariablesJob = new PrepareEnvironmentalVariablesJob(buildInstance);
        dependantJobsExecutor.add(prepareEnvironmentalVariablesJob, previousJobs.concat(lastBeforeBuildTaskJobs));

        var prepareSummaryItemsJob = new PrepareSummaryItemsJob(buildInstance);
        dependantJobsExecutor.add(prepareSummaryItemsJob, [prepareEnvironmentalVariablesJob]);

        var runDockerComposeJob = new RunDockerComposeJob(buildInstance);
        dependantJobsExecutor.add(runDockerComposeJob, [prepareSummaryItemsJob]);

        return dependantJobsExecutor;
    }

    return {
        createBuildInstanceDependantJobsExecutor
    };

};
