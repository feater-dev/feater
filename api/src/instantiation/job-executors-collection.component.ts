import * as _ from 'lodash';
import { Component } from '@nestjs/common';
import { JobInterface } from './job/job';
import { JobExecutorInterface } from './job/job-executor';
import { ConnectContainersToNetworkJobExecutor } from './job/connect-containers-to-network-job';
import { CopyBeforeBuildTaskJobExecutor } from './job/copy-before-build-task.job';
import { CreateDirectoryJobExecutor } from './job/create-directory.job';
import { DownloadSourceJobExecutor } from './job/download-source.job';
import { ExtractSourceJobExecutor } from './job/extract-source.job';
import { GetContainerIdsJobExecutor } from './job/get-container-ids.job';
import { InterpolateBeforeBuildTaskJobExecutor } from './job/interpolate-before-build-task.job';
import { ParseDockerComposeJobExecutor } from './job/parse-docker-compose.job';
import { PrepareEnvironmentalVariablesJobExecutor } from './job/prepare-environmental-variables.job';
import { PreparePortDomainsJobExecutor } from './job/prepare-port-domains.job';
import { PrepareSummaryItemsJobExecutor } from './job/prepare-summary-items.job';
import { ProxyPortDomainsJobExecutor } from './job/proxy-port-domains.job';
import { ResolveReferenceJobExecutor } from './job/resolve-reference.job';
import { RunDockerComposeJobExecutor } from './job/run-docker-compose.job';

@Component()
export class JobExecutorsCollection {

    private jobExecutors: JobExecutorInterface[];

    constructor(
        connectContainersToNetworkJobExecutor: ConnectContainersToNetworkJobExecutor,
        copyBeforeBuildTaskJobExecutor: CopyBeforeBuildTaskJobExecutor,
        createDirectoryJobExecutor: CreateDirectoryJobExecutor,
        downloadSourceJobExecutor: DownloadSourceJobExecutor,
        extractSourceJobExecutor: ExtractSourceJobExecutor,
        getContainerIdsJobExecutor: GetContainerIdsJobExecutor,
        interpolateBeforeBuildTaskJobExecutor: InterpolateBeforeBuildTaskJobExecutor,
        parseDockerComposeJobExecutor: ParseDockerComposeJobExecutor,
        prepareEnvironmentalVariablesJobExecutor: PrepareEnvironmentalVariablesJobExecutor,
        preparePortDomainsJobExecutor: PreparePortDomainsJobExecutor,
        prepareSummaryItemsJobExecutor: PrepareSummaryItemsJobExecutor,
        proxyPortDomainsJobExecutor: ProxyPortDomainsJobExecutor,
        resolveReferenceJobExecutor: ResolveReferenceJobExecutor,
        runDockerComposeJobExecutor: RunDockerComposeJobExecutor,
    ) {
        this.jobExecutors = [
            connectContainersToNetworkJobExecutor,
            copyBeforeBuildTaskJobExecutor,
            createDirectoryJobExecutor,
            downloadSourceJobExecutor,
            extractSourceJobExecutor,
            getContainerIdsJobExecutor,
            interpolateBeforeBuildTaskJobExecutor,
            parseDockerComposeJobExecutor,
            prepareEnvironmentalVariablesJobExecutor,
            preparePortDomainsJobExecutor,
            prepareSummaryItemsJobExecutor,
            proxyPortDomainsJobExecutor,
            resolveReferenceJobExecutor,
            runDockerComposeJobExecutor,
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
            throw new Error(`No supporting job executor for job ${job.toString()}.`);
        }

        if (supportingJobExecutors.length > 1) {
            throw new Error(`More than one supporting job executor for job ${job.toString()}.`);
        }

        return supportingJobExecutors[0];
    }

}
