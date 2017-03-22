var _ = require('underscore');
var path = require('path');
var fs = require('fs-extra');
var Promise = require('bluebird');
var { exec, spawn } = require('child_process');

module.exports = function (config, portProvider, interpolationHelper, buildInstanceRepository, githubApiClient) {

    const BUFFER_SIZE = 64 * 1024 * 1024;

    // Generic jon

    class Job {
        setResult(result) {
            this.result = result;

            return this;
        }

        getResult() {
            return this.result;
        }
    }

    function jobToString(job) {
        if (job instanceof BuildInstanceJob) {
            return `${job.constructor.name} for build ${job.buildInstance.id}`;
        }
        if (job instanceof ComponentInstanceJob) {
            return `${job.constructor.name} for build ${job.componentInstance.buildInstance.id} and component ${job.componentInstance.id}`;
        }

        return `unknown job`;
    }

    // Build instance jobs.

    class BuildInstanceJob extends Job {
        constructor(buildInstance) {
            super();
            this.buildInstance = buildInstance;
        }
    }

    class CreateDirectoryJob extends BuildInstanceJob {}

    class ProvidePortJob extends BuildInstanceJob {
        constructor(buildInstance, portName, portRanges) {
            super(buildInstance);
            this.portName = portName;
            this.portRanges = portRanges;
        }
    }

    class PrepareEnvironmentalVariablesJob extends BuildInstanceJob {}

    class PrepareSummaryItemsJob extends BuildInstanceJob {}

    class RunDockerComposeJob extends BuildInstanceJob {}

    // Component instance jobs.

    class ComponentInstanceJob extends Job {
        constructor(componentInstance) {
            super();
            this.componentInstance = componentInstance;
        }
    }

    class ResolveReferenceJob extends ComponentInstanceJob {}

    class DownloadArchiveJob extends ComponentInstanceJob {}

    class ExtractArchiveJob extends ComponentInstanceJob {}

    class CopyBeforeBuildTaskJob extends ComponentInstanceJob {
        constructor(componentInstance, sourceRelativePath, destinationRelativePath) {
            super(componentInstance);
            this.sourceRelativePath = sourceRelativePath;
            this.destinationRelativePath = destinationRelativePath;
        }
    }

    class InterpolateBeforeBuildTaskJob extends ComponentInstanceJob {
        constructor(componentInstance, relativePath) {
            super(componentInstance);
            this.relativePath = relativePath;
        }
    }

    class RunAfterBuildTaskJob extends ComponentInstanceJob {
        constructor(componentInstance, scriptPath) {
            super(componentInstance);
            this.scriptPath = scriptPath;
        }
    }

    // Job dependencies.

    class ObjectMap {
        constructor() {
            this.entries = []
        }

        has(key) {
            for (var i = 0; i < this.entries.length; i += 1) {
                if (this.entries[i].key === key) {
                    return true;
                }
            }

            return false;
        }

        keys() {
            return _.map(this.entries, (entry) => {
                return entry.key;
            });
        }

        set(key, value) {
            if (this.has(key)) {
                //console.log(`DEBUG --- Failed to set key for ${jobToString(key)}`);

                throw new Error(`Failed to set key ${key}.`);
            }
            this.entries.push(new ObjectMapEntry(key, value));

            return this;
        }

        get(key) {
            for (var i = 0; i < this.entries.length; i += 1) {
                if (this.entries[i].key === key) {
                    return this.entries[i].value;
                }
            }

            throw new Error(`Failed to get value for key ${key}.`);
        }
    }

    class ObjectMapEntry {
        constructor(key, value) {
            this.key = key;
            this.value = value;
        }
    }

    class DependantJobsExecutor {
        constructor(jobExecutorCollection) {
            this.jobExecutorCollection = jobExecutorCollection;

            this.jobToRequiredJobsMap = new ObjectMap();
            this.jobToPromiseMap = new ObjectMap();
            this.pendingJobsCount = 0;
        }

        add(job, requiredJobs = []) {
            if (this.jobToRequiredJobsMap.has(job)) {
                throw new Error(`Job already added.`);
            }
            this.jobToRequiredJobsMap.set(job, requiredJobs);
        }

        assertJobDependenciesConsistency() {
            this.jobToRequiredJobsMap.keys().forEach((job) => {
                this.jobToRequiredJobsMap.get(job).forEach((requiredJob) => {
                    if (!this.jobToRequiredJobsMap.has(requiredJob)) {
                        throw new Error('Inconsistent required job.');
                    }
                });
            });
        }

        findExecutableJobs() {
            return _.filter(
                this.jobToRequiredJobsMap.keys(),
                (job) => {
                    var requiredJobs;

                    // First check if job is already fulfilled, rejected or cancelled.
                    if (this.jobToPromiseMap.has(job)) {
                        return false;
                    }

                    // Then check if its required jobs are all fulfilled.
                    requiredJobs = this.jobToRequiredJobsMap.get(job);
                    for (var i = 0; i < requiredJobs.length; i += 1) {
                        if (
                            !this.jobToPromiseMap.has(requiredJobs[i])
                            || !this.jobToPromiseMap.get(requiredJobs[i]).isFulfilled()
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );
        }

        areAllJobsExecuted() {
            var notExecutedJobs = _.filter(
                this.jobToRequiredJobsMap.keys(),
                (job) => {
                    return (
                        !this.jobToPromiseMap.has(job)
                        || !this.jobToPromiseMap.get(job).isFulfilled()
                    );
                }
            );

            return (notExecutedJobs.length > 0);
        }

        increasePendingJobsCount() {
            this.pendingJobsCount += 1;

            return this;
        }

        decreasePendingJobsCount() {
            this.pendingJobsCount -= 1;

            return this;
        }

        hasPendingJobs() {
            return (this.pendingJobsCount > 0);
        }

        execute() {
            //console.log(`DEBUG --- Execute all`);
            this.assertJobDependenciesConsistency();

            return new Promise((resolve, reject) => {
                var executeNext = () => {
                    //console.log(`DEBUG --- Execute next`);
                    var executableJobs = this.findExecutableJobs();

                    if (0 === executableJobs.length) {
                        if (this.hasPendingJobs()) {
                            return;
                        }
                        if (!this.areAllJobsExecuted()) {
                            reject();

                            return;
                        }
                        resolve();

                        return;
                    }

                    //console.log(`DEBUG --- Executable jobs: ${_.map(executableJobs, (executableJob) => jobToString(executableJob)).join(', ')}`);

                    executableJobs.forEach((executableJob) => {
                        var executableJobPromise = this.jobExecutorCollection
                            .getSupporting(executableJob)
                            .execute(executableJob);

                        //console.log(`DEBUG --- Increased pending jobs count to ${this.pendingJobsCount}`);
                        this.increasePendingJobsCount();
                        this.jobToPromiseMap.set(executableJob, executableJobPromise);

                        executableJobPromise.finally(() => {
                            //console.log(`DEBUG --- Job ${jobToString(executableJob)} is ${executableJobPromise.isFulfilled() ? 'fulfilled' : 'not fulfilled'} and its result is ${JSON.stringify(executableJob.getResult())}`);
                            this.decreasePendingJobsCount();
                            //console.log(`DEBUG --- Decreased pending jobs count to ${this.pendingJobsCount}`);
                            process.nextTick(executeNext);
                        });
                    });
                };

                process.nextTick(executeNext);
            });
        }
    }

    // Job executors.

    class JobExecutor {}

    class CreateDirectoryJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof CreateDirectoryJob);
        }

        execute(job) {
            return new Promise((resolve) => {
                var { buildInstance } = job;
                var fullPath = path.join('/home/mariusz/Development/Feat/buildInstances', buildInstance.id); // TODO Base directory should be given from outside.
                fs.mkdirSync(fullPath);  // TODO Check if this directory doesn't already exist.
                buildInstance.fullPath = fullPath;
                job.setResult({ fullPath });

                resolve();

            });
        }
    }

    class ProvidePortJobExecutor extends JobExecutor {
        supports (job) {
            return (job instanceof ProvidePortJob);
        }

        execute(job) {
            var { buildInstance } = job;

            return new Promise((resolve) => {
                var port = portProvider.providePort(
                    _.map(job.portRanges, (portRange) => ({ minPort: portRange[0], maxPort: portRange[1] }))
                );
                buildInstance.addExternalPort(job.portName, port);

                buildInstance.log(`Assigned port ${port} for ${job.portName} external port.`);

                buildInstanceRepository
                    .updateExternalPorts(buildInstance)
                    .then(resolve);
            });
        }
    }

    class PrepareEnvironmentalVariablesJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof PrepareEnvironmentalVariablesJob);
        }

        execute(job) {
            var { buildInstance } = job;

            return new Promise((resolve) => {
                _.each(
                    buildInstance.componentInstances,
                    (componentInstance, componentId) => {
                        buildInstance.addEnvironmentalVariable(`FEAT__PATH__${componentId.toUpperCase()}`, componentInstance.fullPath);
                    }
                );
                _.each(
                    buildInstance.externalPorts,
                    (port, portId) => {
                        buildInstance.addEnvironmentalVariable(`FEAT__PORT__${portId.toUpperCase()}`, port);
                    }
                );
                _.each(
                    buildInstance.featVariables,
                    (value, name) => {
                        buildInstance.addEnvironmentalVariable(`FEAT__${name.toUpperCase()}`, value)
                    }
                );
                _.each(
                    buildInstance.config.environmentalVariables,
                    (value, name) => {
                        buildInstance.addEnvironmentalVariable(
                            name,
                            interpolationHelper.interpolateText(value, buildInstance.featVariables, buildInstance.externalPorts)
                        )
                    }
                );

                buildInstance.log(`Environmental variables set to ${buildInstance.getEnvironmentalVariablesString()}`);

                buildInstanceRepository
                    .updateEnvironmentalVariables(buildInstance)
                    .then(resolve());
            });
        }
    }

    class PrepareSummaryItemsJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof PrepareSummaryItemsJob);
        }

        execute(job) {
            var { buildInstance } = job;

            return new Promise((resolve) => {
                _.each(
                    buildInstance.config.summaryItems,
                    (summaryItem) => {
                        buildInstance.addSummaryItem(
                            summaryItem.name,
                            interpolationHelper.interpolateText(summaryItem.value, buildInstance.featVariables, buildInstance.externalPorts)
                        )
                    }
                );

                buildInstance.log(`Summary items set.`);

                buildInstanceRepository
                    .updateSummaryItems(buildInstance)
                    .then(resolve());
            });
        }
    }

    class RunDockerComposeJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof RunDockerComposeJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                var { buildInstance } = job;
                var dockerComposeDirectoryFullPath = path.join(
                    buildInstance.componentInstances[buildInstance.config.composeFile.componentId].fullPath,
                    path.dirname(buildInstance.config.composeFile.relativePath)
                );
                var dockerComposeFileName = path.basename(buildInstance.config.composeFile.relativePath);
                var dockerComposeEnvironemntalVariables = _.extend(
                    {},
                    buildInstance.environmentalVariables,
                    {
                        COMPOSE_PROJECT_NAME: `feat${buildInstance.id}`,
                        COMPOSE_HTTP_TIMEOUT: 5000,
                        PATH: '/usr/local/bin/' // TODO Move to config.
                    }
                );

                buildInstance.log('Running docker-compose.');

                var dockerCompose = spawn(
                    'docker-compose', ['--file', dockerComposeFileName, 'up', '-d', '--no-color'],
                    {
                        cwd: dockerComposeDirectoryFullPath,
                        env: dockerComposeEnvironemntalVariables
                    }
                );

                var stdoutLogger = buildInstance.logger.createNested('docker-compose stdout', { splitLines: true });
                dockerCompose.stdout.on('data', (data) => {
                    stdoutLogger.debug(data.toString());
                });

                var stderrLogger = buildInstance.logger.createNested('docker-compose stderr', { splitLines: true });
                dockerCompose.stderr.on('data', (data) => {
                    stderrLogger.error(data.toString());
                });

                dockerCompose.on('error', (error) => {
                    reject(error);
                });

                dockerCompose.on('exit', (code) => {
                    if (0 !== code) {
                        buildInstance.log('Failed to run docker-compose.');
                        reject(code);

                        return;
                    }

                    buildInstance.log('Succeeded to run docker-compose.');
                    resolve();
                });
            });
        }
    }

    class RunAfterBuildTaskJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof RunAfterBuildTaskJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                var { componentInstance, scriptPath } = job;
                var componentId = componentInstance.id;
                var scriptFullPath = path.join(componentInstance.fullPath, scriptPath);
                var env = _.extend(
                    {},
                    componentInstance.buildInstance.environmentalVariables,
                    {
                        FEAT__INSTANCE_ID: componentInstance.buildInstance.id,
                    }
                )

                componentInstance.log(`Running ${scriptPath}.`);

                exec(scriptFullPath, {
                    cwd: componentInstance.fullPath,
                    env: env,
                }, (error, stdout) => {
                    if (error) {
                        componentInstance.error(`Failed to execute ${scriptPath}`);
                        reject(error);

                        return;
                    }

                    componentInstance.log(stdout);
                    componentInstance.log(`Succeeded to execute ${scriptPath}`);
                    resolve();
                });
            });
        }
    }

    class ResolveReferenceJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ResolveReferenceJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                var { source, reference } = job.componentInstance.config;
                if (!source || !reference) {
                    reject(Error('Missing source or reference.'));

                    return;
                }
                if (source.type !== 'github') {
                    reject(new Error(`Source type ${source.type} not supported.`));

                    return;
                }

                githubApiClient
                    .getRepo(source.name)
                    .then(
                        () => {
                            var commitPromise;

                            switch (reference.type) {
                                case 'tag':
                                    commitPromise = githubApiClient.getTagCommit(source.name, reference.name);
                                    break;

                                case 'branch':
                                    commitPromise = githubApiClient.getBranchCommit(source.name, reference.name);
                                    break;

                                case 'commit':
                                    commitPromise = githubApiClient.getCommit(source.name, reference.name);
                                    break;

                                default:
                                    reject(new Error(`Reference type ${reference.type} not supported.`));

                                    return;
                            }

                            commitPromise.then(
                                (commit) => {
                                    var resolvedReference = {
                                        type: 'commit',
                                        repository: source.name,
                                        commit: commit
                                    };
                                    job.componentInstance.resolvedReference = resolvedReference;
                                    job.setResult({ resolvedReference });
                                    resolve();
                                },
                                (error) => { reject(error); }
                            );
                        },
                        (error) => { reject(error); }
                    );
            });
        }
    }

    class DownloadArchiveJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof DownloadArchiveJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                var { componentInstance, componentInstance: { buildInstance } } = job;
                var { repository, commit } = componentInstance.resolvedReference;
                var zipFileUrl = `https://api.github.com/repos/${repository}/zipball/${commit.sha}`;
                var zipFileFullPath = path.join(buildInstance.fullPath, `${repository.replace('/', '-')}-${commit.sha}.zip`);

                componentInstance.zipFileUrl = zipFileUrl;
                componentInstance.zipFileFullPath = zipFileFullPath;

                componentInstance.log(`Downloading archive for repository ${repository} at commit ${commit.sha}.`);
                exec(
                    `curl -s -H "Authorization: token ${config.github.personalAccessToken}" -L ${zipFileUrl} > ${zipFileFullPath}`,
                    { maxBuffer: BUFFER_SIZE },
                    (error) => {
                        if (error) {
                            componentInstance.log('Failed to download archive.');
                            reject(error);

                            return;
                        }
                        componentInstance.log('Succeeded to download archive.');

                        resolve({
                            zipFileUrl,
                            zipFileFullPath
                        });
                    }
                );
            });
        }
    }

    class ExtractArchiveJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ExtractArchiveJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                var { componentInstance, componentInstance: { buildInstance } } = job;
                var extractedFullPath = path.join(
                    buildInstance.fullPath,
                    path.basename(componentInstance.zipFileFullPath, '.zip')
                );

                componentInstance.relativePath = componentInstance.id;

                componentInstance.log('Extracting archive.');
                exec(
                    [
                        `unzip ${componentInstance.zipFileFullPath} -d ${buildInstance.fullPath}`,
                        `mv ${extractedFullPath} ${componentInstance.fullPath}`,
                        `rm ${componentInstance.zipFileFullPath}`
                    ].join(' && '),
                    { maxBuffer: BUFFER_SIZE },
                    (error) => {
                        if (error) {
                            componentInstance.log('Failed to extract archive.');
                            reject(error);

                            return;
                        }
                        componentInstance.log('Succeeded to extract archive.');

                        resolve();
                    }
                );
            });
        }
    }

    class CopyBeforeBuildTaskJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof CopyBeforeBuildTaskJob);
        }

        execute(job) {
            var { componentInstance, sourceRelativePath, destinationRelativePath } = job;

            return new Promise((resolve) => {
                componentInstance.log(`Copying ${sourceRelativePath} to ${destinationRelativePath}.`);
                fs.copySync(
                    path.join(componentInstance.fullPath, sourceRelativePath),
                    path.join(componentInstance.fullPath, destinationRelativePath)
                );

                resolve();
            });
        }
    }

    class InterpolateBeforeBuildTaskJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof InterpolateBeforeBuildTaskJob);
        }

        execute(job) {
            var { componentInstance } = job;

            return new Promise((resolve) => {
                var fullPath = path.join(componentInstance.fullPath, job.relativePath);
                var { featVariables, externalPorts } = componentInstance.buildInstance;

                componentInstance.log(`Interpolating Feat variables in ${job.relativePath}.`);
                interpolationHelper.interpolateFile(fullPath, featVariables, externalPorts);

                resolve();
            });
        }
    }

    class JobExecutorCollection {
        constructor() {
            this.jobExecutors = [];
        }

        add(jobExecutor) {
            this.jobExecutors.push(jobExecutor);

            return this;
        }

        getSupporting(job) {
            var supportingJobExecutors = _.filter(
                this.jobExecutors,
                (jobExecutor) => jobExecutor.supports(job)
            );
            if (0 === supportingJobExecutors.length) {
                throw new Error(`No supporting job executor for job ${jobToString(job)}.`);
            }
            if (supportingJobExecutors.length > 1) {
                throw new Error(`More than one supporting job executor for job ${jobToString(job)}.`);
            }

            return supportingJobExecutors[0];
        }
    }




    // Factory method.

    function createBuildInstanceDependantJobsExecutor(buildInstance) {
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
            .add(new InterpolateBeforeBuildTaskJobExecutor())
            .add(new RunAfterBuildTaskJobExecutor());

        var dependantJobsExecutor = new DependantJobsExecutor(jobExecutorCollection);

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

        var providePortJobs = _.map(
            buildInstance.config.externalPorts,
            ({ ranges: portRanges }, portName) => {
                var job = new ProvidePortJob(buildInstance, portName, portRanges);
                dependantJobsExecutor.add(job, extractArchiveJobs);

                return job;
            }
        );

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
                            providePortJobs.concat(componentIdToBeforeBuildTaskJobsMap[componentId].slice(-1))
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
        dependantJobsExecutor.add(prepareEnvironmentalVariablesJob, providePortJobs.concat(lastBeforeBuildTaskJobs));

        var prepareSummaryItemsJob = new PrepareSummaryItemsJob(buildInstance);
        dependantJobsExecutor.add(prepareSummaryItemsJob, [prepareEnvironmentalVariablesJob]);

        var runDockerComposeJob = new RunDockerComposeJob(buildInstance);
        dependantJobsExecutor.add(runDockerComposeJob, [prepareSummaryItemsJob]);

        _.each(
            buildInstance.componentInstances,
            (componentInstance) => {
                _.each(
                    componentInstance.config.afterBuildScripts,
                    scriptPath => dependantJobsExecutor.add(
                        new RunAfterBuildTaskJob(componentInstance, scriptPath),
                        [runDockerComposeJob]
                    );
                );
            }
        );

        return dependantJobsExecutor;
    }

    return {
        createBuildInstanceDependantJobsExecutor
    };
}
