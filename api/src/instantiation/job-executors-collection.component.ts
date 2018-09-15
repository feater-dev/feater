import * as _ from 'lodash';
import {Component} from '@nestjs/common';
import {JobInterface} from './job/job';
import {JobExecutorInterface} from './job/job-executor';
import {ConnectContainersToNetworkJobExecutor} from './job/connect-containers-to-network-job';
import {CopyBeforeBuildTaskJobExecutor} from './job/copy-before-build-task.job';
import {CreateDirectoryJobExecutor} from './job/create-directory.job';
import {CloneSourceJobExecutor} from './job/clone-source.job';
import {GetContainerIdsJobExecutor} from './job/get-container-ids.job';
import {InterpolateBeforeBuildTaskJobExecutor} from './job/interpolate-before-build-task.job';
import {ParseDockerComposeJobExecutor} from './job/parse-docker-compose.job';
import {PrepareEnvVariablesJobExecutor} from './job/prepare-env-variables.job';
import {PreparePortDomainsJobExecutor} from './job/prepare-port-domains.job';
import {PrepareSummaryItemsJobExecutor} from './job/prepare-summary-items.job';
import {ProxyPortDomainsJobExecutor} from './job/proxy-port-domains.job';
import {RunDockerComposeJobExecutor} from './job/run-docker-compose.job';
import {ExecuteHostCommandAfterBuildTaskJobExecutor} from './job/execute-host-command-after-build-task.job';
import {ExecuteServiceCommandAfterBuildTaskJobExecutor} from './job/execute-service-command-after-build-task.job';
import {CopyAssetIntoContainerAfterBuildTaskJobExecutor} from './job/copy-asset-into-container-after-build-task.job';
import {CreateVolumeFromAssetJobExecutor} from './job/create-volume-from-asset.job';

@Component()
export class JobExecutorsCollection {

    private jobExecutors: JobExecutorInterface[];

    constructor(
        connectContainersToNetworkJobExecutor: ConnectContainersToNetworkJobExecutor,
        copyBeforeBuildTaskJobExecutor: CopyBeforeBuildTaskJobExecutor,
        createDirectoryJobExecutor: CreateDirectoryJobExecutor,
        cloneSourceJobExecutor: CloneSourceJobExecutor,
        getContainerIdsJobExecutor: GetContainerIdsJobExecutor,
        interpolateBeforeBuildTaskJobExecutor: InterpolateBeforeBuildTaskJobExecutor,
        parseDockerComposeJobExecutor: ParseDockerComposeJobExecutor,
        prepareEnvVariablesJobExecutor: PrepareEnvVariablesJobExecutor,
        preparePortDomainsJobExecutor: PreparePortDomainsJobExecutor,
        prepareSummaryItemsJobExecutor: PrepareSummaryItemsJobExecutor,
        proxyPortDomainsJobExecutor: ProxyPortDomainsJobExecutor,
        runDockerComposeJobExecutor: RunDockerComposeJobExecutor,
        executeHostCommandAfterBuildTaskJobExecutor: ExecuteHostCommandAfterBuildTaskJobExecutor,
        executeServiceCommandAfterBuildTaskJobExecutor: ExecuteServiceCommandAfterBuildTaskJobExecutor,
        copyTaskIntoContainerAfterBuildTaskJobExecutor: CopyAssetIntoContainerAfterBuildTaskJobExecutor,
        createVolumeFromAssetJobExecutor: CreateVolumeFromAssetJobExecutor,
    ) {
        this.jobExecutors = [
            connectContainersToNetworkJobExecutor,
            copyBeforeBuildTaskJobExecutor,
            createDirectoryJobExecutor,
            cloneSourceJobExecutor,
            getContainerIdsJobExecutor,
            interpolateBeforeBuildTaskJobExecutor,
            parseDockerComposeJobExecutor,
            prepareEnvVariablesJobExecutor,
            preparePortDomainsJobExecutor,
            prepareSummaryItemsJobExecutor,
            proxyPortDomainsJobExecutor,
            runDockerComposeJobExecutor,
            executeHostCommandAfterBuildTaskJobExecutor,
            executeServiceCommandAfterBuildTaskJobExecutor,
            copyTaskIntoContainerAfterBuildTaskJobExecutor,
            createVolumeFromAssetJobExecutor,
        ];
    }

    execute(job: JobInterface, data: any): Promise<any> {
        return this.getSupportingJobExecutor(job).execute(job, data);
    }

    private getSupportingJobExecutor(job: JobInterface): JobExecutorInterface {
        const supportingJobExecutors = _.filter(
            this.jobExecutors,
            (jobExecutor) => jobExecutor.supports(job),
        );

        if (0 === supportingJobExecutors.length) {
            throw new Error(`No supporting job executor for job of class ${job.constructor.name}.`);
        }

        if (supportingJobExecutors.length > 1) {
            throw new Error(`More than one supporting job executor for job of class ${job.constructor.name}.`);
        }

        return supportingJobExecutors[0];
    }

}
