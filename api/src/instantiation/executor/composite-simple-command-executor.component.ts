import {Injectable} from '@nestjs/common';
import {SimpleCommandExecutorComponentInterface} from './simple-command-executor-component.interface';
import {SimpleCommand} from './simple-command';
import {ConnectToNetworkCommandExecutorComponent} from '../command/connect-containers-to-network/command-executor.component';
import {CopyFileCommandExecutorComponent} from '../command/before-build/copy-file/command-executor.component';
import {CreateDirectoryCommandExecutorComponent} from '../command/create-directory/command-executor.component';
import {CloneSourceCommandExecutorComponent} from '../command/clone-source/command-executor.component';
import {GetContainerIdsCommandExecutorComponent} from '../command/get-container-id/command-executor.component';
import {InterpolateFileCommandExecutorComponent} from '../command/before-build/interpolate-file/command-executor.component';
import {ParseDockerComposeCommandExecutorComponent} from '../command/parse-docker-compose/command-executor.component';
import {PrepareSourceEnvVarsCommandExecutorComponent} from '../command/prepare-source-env-vars/command-executor.component';
import {PrepareProxyDomainCommandExecutorComponent} from '../command/prepare-port-domain/command-executor.component';
import {ConfigureProxyDomainCommandExecutorComponent} from '../command/configure-proxy-domain/command-executor.component';
import {PrepareSummaryItemsCommandExecutorComponent} from '../command/prepare-summary-items/command-executor.component';
import {RunDockerComposeCommandExecutorComponent} from '../command/run-docker-compose/command-executor.component';
import {PrepareRunDockerComposeCommandExecutorComponent} from '../command/prepare-run-docker-compose/command-executor.component';
import {ExecuteHostCmdCommandExecutorComponent} from '../command/after-build/execute-host-cmd/command-executor.component';
import {ExecuteServiceCmdCommandExecutorComponent} from '../command/after-build/execute-service-cmd/command-executor.component';
import {CopyAssetIntoContainerCommandExecutorComponent} from '../command/after-build/copy-asset-into-container/command-executor.component';
import {CreateVolumeFromAssetCommandExecutorComponent} from '../command/create-volume-from-asset/command-executor.component';
import {EnableProxyDomainsCommandExecutorComponent} from '../command/enable-proxy-domains/command-executor.component';
import {MoveSourceToVolumeCommandExecutorComponent} from '../command/move-source-to-volume/command-executor.component';

@Injectable()
export class CompositeSimpleCommandExecutorComponent {

    private executors: SimpleCommandExecutorComponentInterface[];

    constructor(
        connectToNetworkCommandExecutorComponent: ConnectToNetworkCommandExecutorComponent,
        copyFileCommandExecutorComponent: CopyFileCommandExecutorComponent,
        createDirectoryCommandExecutorComponent: CreateDirectoryCommandExecutorComponent,
        cloneSourceCommandExecutorComponent: CloneSourceCommandExecutorComponent,
        moveSourceToVolumeCommandExecutorComponent: MoveSourceToVolumeCommandExecutorComponent,
        getContainerIdsCommandExecutorComponent: GetContainerIdsCommandExecutorComponent,
        interpolateBeforeBuildTaskCommandExecutorComponent: InterpolateFileCommandExecutorComponent,
        parseDockerComposeCommandExecutorComponent: ParseDockerComposeCommandExecutorComponent,
        prepareEnvVariablesForSourceCommandExecutorComponent: PrepareSourceEnvVarsCommandExecutorComponent,
        prepareProxyDomainCommandExecutorComponent: PrepareProxyDomainCommandExecutorComponent,
        prepareProxyDomainConfigCommandExecutorComponent: ConfigureProxyDomainCommandExecutorComponent,
        prepareSummaryItemsCommandExecutorComponent: PrepareSummaryItemsCommandExecutorComponent,
        runDockerComposeCommandExecutorComponent: RunDockerComposeCommandExecutorComponent,
        prepareRunDockerComposeCommandExecutorComponent: PrepareRunDockerComposeCommandExecutorComponent,
        executeHostCmdCommandExecutorComponent: ExecuteHostCmdCommandExecutorComponent,
        executeServiceCmdCommandExecutorComponent: ExecuteServiceCmdCommandExecutorComponent,
        copyAssetIntoContainerCommandExecutorComponent: CopyAssetIntoContainerCommandExecutorComponent,
        createVolumeFromAssetCommandExecutorComponent: CreateVolumeFromAssetCommandExecutorComponent,
        enableProxyDomainsCommandExecutorComponent: EnableProxyDomainsCommandExecutorComponent,
    ) {
        this.executors = [
            connectToNetworkCommandExecutorComponent,
            copyFileCommandExecutorComponent,
            createDirectoryCommandExecutorComponent,
            cloneSourceCommandExecutorComponent,
            moveSourceToVolumeCommandExecutorComponent,
            getContainerIdsCommandExecutorComponent,
            interpolateBeforeBuildTaskCommandExecutorComponent,
            parseDockerComposeCommandExecutorComponent,
            prepareEnvVariablesForSourceCommandExecutorComponent,
            prepareProxyDomainCommandExecutorComponent,
            prepareProxyDomainConfigCommandExecutorComponent,
            prepareSummaryItemsCommandExecutorComponent,
            runDockerComposeCommandExecutorComponent,
            prepareRunDockerComposeCommandExecutorComponent,
            executeHostCmdCommandExecutorComponent,
            executeServiceCmdCommandExecutorComponent,
            copyAssetIntoContainerCommandExecutorComponent,
            createVolumeFromAssetCommandExecutorComponent,
            enableProxyDomainsCommandExecutorComponent,
        ];
    }

    execute(job: SimpleCommand): Promise<any> {
        return this.getSupportingExecutor(job).execute(job);
    }

    protected getSupportingExecutor(command: SimpleCommand): SimpleCommandExecutorComponentInterface {
        const supportingExecutors = this.executors.filter(
            (executor: SimpleCommandExecutorComponentInterface) => executor.supports(command),
        );

        if (1 === supportingExecutors.length) {
            return supportingExecutors[0];
        }

        if (0 === supportingExecutors.length) {
            throw new Error(`No supporting executor for command of class ${command.constructor.name}.`);
        }

        throw new Error(`Multiple supporting executors for command of class ${command.constructor.name}.`);
    }

}
