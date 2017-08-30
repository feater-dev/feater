var _ = require('underscore');
var path = require('path');
var fs = require('fs-extra');
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
    executor,
    runners
) {

    var { ResolveReferenceJob, ResolveReferenceJobExecutor } = resolveReference;
    var { CreateDirectoryJob, CreateDirectoryJobExecutor } = createDirectory;
    var { DownloadArchiveJob, DownloadArchiveJobExecutor } = downloadArchive;
    var { ExtractArchiveJob, ExtractArchiveJobExecutor } = extractArchive;
    var { ProvidePortJob, ProvidePortJobExecutor } = providePort;
    var { CopyBeforeBuildTaskJob, CopyBeforeBuildTaskJobExecutor } = copyBeforeBuildTask;
    var { InterpolateBeforeBuildTaskJob, InterpolateBeforeBuildTaskJobExecutor } = interpolateBeforeBuildTask;
    var { PrepareEnvironmentalVariablesJob, PrepareEnvironmentalVariablesJobExecutor } = prepareEnvironmentalVariables;
    var { PrepareSummaryItemsJob, PrepareSummaryItemsJobExecutor } = prepareSummaryItems;
    var { RunDockerComposeJob, RunDockerComposeJobExecutor } = runDockerCompose;

    var { JobExecutorCollection } = executor;

    var { PromiseRunner, JobRunner } = runners;

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
                (componentInstance) => {
                    return new JobRunner(jobExecutorCollection, [
                        new ResolveReferenceJob(componentInstance),
                        new DownloadArchiveJob(componentInstance),
                        new ExtractArchiveJob(componentInstance)
                    ]);
                }
            )
        });

        stages.push({
            jobRunners: _.map(
                buildInstance.config.externalPorts,
                ({ranges: portRanges}, portName) => {
                    return new JobRunner(jobExecutorCollection, [
                        new ProvidePortJob(buildInstance, portName, portRanges)
                    ]);
                }
            )
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
                    throw new Error(`Unknown type of before build task ${beforeBuildTask.type} for component ${componentId}.`);
            }
        }

        stages.push({
            jobRunners: _.map(
                buildInstance.componentInstances,
                (componentInstance) => {
                    return new JobRunner(
                        jobExecutorCollection,
                        _.map(componentInstance.config.beforeBuildTasks, (beforeBuildTask) => {
                            return mapBeforeBuildTaskToJob(beforeBuildTask, componentInstance);
                        })
                    );
                }
            )
        });

        stages.push({
            jobRunners: [
                new JobRunner(jobExecutorCollection, [
                    new PrepareEnvironmentalVariablesJob(buildInstance),
                    new PrepareSummaryItemsJob(buildInstance),
                    new RunDockerComposeJob(buildInstance)
                ])
            ]
        });
        
        function createStagePromiseRunner({jobRunners}) {
            return new PromiseRunner(
                _.map(jobRunners, (jobRunner) => {
                    return () => {
                        return jobRunner.runInSequence();
                    };
                })
            );
        }
        
        let buildInstancePromiseRunner = new PromiseRunner(
            _.map(stages, (stage) => {
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
