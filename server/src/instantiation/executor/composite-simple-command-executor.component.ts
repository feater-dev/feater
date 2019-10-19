import { Injectable } from '@nestjs/common';
import { SimpleCommandExecutorComponentInterface } from './simple-command-executor-component.interface';
import { SimpleCommand } from './simple-command';
import {
    ConnectToNetworkCommandExecutorComponent,
    CopyFileCommandExecutorComponent,
    CreateDirectoryCommandExecutorComponent,
    CloneSourceCommandExecutorComponent,
    GetContainerIdsCommandExecutorComponent,
    InterpolateFileCommandExecutorComponent,
    ParseDockerComposeCommandExecutorComponent,
    PrepareProxyDomainCommandExecutorComponent,
    ConfigureProxyDomainCommandExecutorComponent,
    PrepareSummaryItemsCommandExecutorComponent,
    ResetSourceCommandExecutorComponent,
    RunDockerComposeCommandExecutorComponent,
    ExecuteServiceCmdCommandExecutorComponent,
    CopyAssetIntoContainerCommandExecutorComponent,
    CreateAssetVolumeCommandExecutorComponent,
    EnableProxyDomainsCommandExecutorComponent,
} from '../command';

@Injectable()
export class CompositeSimpleCommandExecutorComponent {
    private executors: SimpleCommandExecutorComponentInterface[];

    constructor(
        connectToNetworkCommandExecutorComponent: ConnectToNetworkCommandExecutorComponent,
        copyFileCommandExecutorComponent: CopyFileCommandExecutorComponent,
        createDirectoryCommandExecutorComponent: CreateDirectoryCommandExecutorComponent,
        cloneSourceCommandExecutorComponent: CloneSourceCommandExecutorComponent,
        getContainerIdsCommandExecutorComponent: GetContainerIdsCommandExecutorComponent,
        interpolateBeforeBuildTaskCommandExecutorComponent: InterpolateFileCommandExecutorComponent,
        parseDockerComposeCommandExecutorComponent: ParseDockerComposeCommandExecutorComponent,
        prepareProxyDomainCommandExecutorComponent: PrepareProxyDomainCommandExecutorComponent,
        prepareProxyDomainConfigCommandExecutorComponent: ConfigureProxyDomainCommandExecutorComponent,
        prepareSummaryItemsCommandExecutorComponent: PrepareSummaryItemsCommandExecutorComponent,
        resetSourceCommandExecutorComponent: ResetSourceCommandExecutorComponent,
        runDockerComposeCommandExecutorComponent: RunDockerComposeCommandExecutorComponent,
        executeServiceCmdCommandExecutorComponent: ExecuteServiceCmdCommandExecutorComponent,
        copyAssetIntoContainerCommandExecutorComponent: CopyAssetIntoContainerCommandExecutorComponent,
        createAssetVolumeCommandExecutorComponent: CreateAssetVolumeCommandExecutorComponent,
        enableProxyDomainsCommandExecutorComponent: EnableProxyDomainsCommandExecutorComponent,
    ) {
        this.executors = [
            connectToNetworkCommandExecutorComponent,
            copyFileCommandExecutorComponent,
            createDirectoryCommandExecutorComponent,
            cloneSourceCommandExecutorComponent,
            getContainerIdsCommandExecutorComponent,
            interpolateBeforeBuildTaskCommandExecutorComponent,
            parseDockerComposeCommandExecutorComponent,
            prepareProxyDomainCommandExecutorComponent,
            prepareProxyDomainConfigCommandExecutorComponent,
            prepareSummaryItemsCommandExecutorComponent,
            resetSourceCommandExecutorComponent,
            runDockerComposeCommandExecutorComponent,
            executeServiceCmdCommandExecutorComponent,
            copyAssetIntoContainerCommandExecutorComponent,
            createAssetVolumeCommandExecutorComponent,
            enableProxyDomainsCommandExecutorComponent,
        ];
    }

    execute(job: SimpleCommand): Promise<unknown> {
        return this.getSupportingExecutor(job).execute(job);
    }

    private getSupportingExecutor(
        command: SimpleCommand,
    ): SimpleCommandExecutorComponentInterface {
        const supportingExecutors = this.executors.filter(
            (executor: SimpleCommandExecutorComponentInterface) =>
                executor.supports(command),
        );

        if (1 === supportingExecutors.length) {
            return supportingExecutors[0];
        }

        if (0 === supportingExecutors.length) {
            throw new Error(
                `No supporting executor for command of class ${command.constructor.name}.`,
            );
        }

        throw new Error(
            `Multiple supporting executors for command of class ${command.constructor.name}.`,
        );
    }
}
