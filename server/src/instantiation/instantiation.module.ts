import {Module} from '@nestjs/common';
import {LoggerModule} from '../logger/logger.module';
import {PersistenceModule} from '../persistence/persistence.module';
import {InstanceCreatorComponent} from './instance-creator.component';
import {InterpolationHelper} from './helper/interpolation-helper.component';
import {ContainerStateCheckerComponent} from './container-state-checker-component.service';
import {ContainerInfoCheckerComponent} from './container-info-checker-component.service';
import {SpawnHelper} from './helper/spawn-helper.component';
import {ConnectToNetworkCommandExecutorComponent} from './command/connect-containers-to-network/command-executor.component';
import {CopyFileCommandExecutorComponent} from './command/before-build/copy-file/command-executor.component';
import {CreateDirectoryCommandExecutorComponent} from './command/create-directory/command-executor.component';
import {CloneSourceCommandExecutorComponent} from './command/clone-source/command-executor.component';
import {GetContainerIdsCommandExecutorComponent} from './command/get-container-id/command-executor.component';
import {InterpolateFileCommandExecutorComponent} from './command/before-build/interpolate-file/command-executor.component';
import {ParseDockerComposeCommandExecutorComponent} from './command/parse-docker-compose/command-executor.component';
import {PrepareProxyDomainCommandExecutorComponent} from './command/prepare-port-domain/command-executor.component';
import {ConfigureProxyDomainCommandExecutorComponent} from './command/configure-proxy-domain/command-executor.component';
import {PrepareSummaryItemsCommandExecutorComponent} from './command/prepare-summary-items/command-executor.component';
import {RunDockerComposeCommandExecutorComponent} from './command/run-docker-compose/command-executor.component';
import {ExecuteHostCmdCommandExecutorComponent} from './command/after-build/execute-host-cmd/command-executor.component';
import {ExecuteServiceCmdCommandExecutorComponent} from './command/after-build/execute-service-cmd/command-executor.component';
import {CopyAssetIntoContainerCommandExecutorComponent} from './command/after-build/copy-asset-into-container/command-executor.component';
import {CreateVolumeFromAssetCommandExecutorComponent} from './command/create-volume-from-asset/command-executor.component';
import {CreateVolumeFromSourceCommandExecutorComponent} from "./command/create-volume-from-source/command-executor.component";
import {CopyFileCommandFactoryComponent} from './command/before-build/copy-file/command-factory.component';
import {InterpolateFileCommandFactoryComponent} from './command/before-build/interpolate-file/command-factory.component';
import {CopyAssetIntoContainerCommandFactoryComponent} from './command/after-build/copy-asset-into-container/command-factory.component';
import {ExecuteHostCmdCommandFactoryComponent} from './command/after-build/execute-host-cmd/command-factory.component';
import {ExecuteServiceCmdCommandFactoryComponent} from './command/after-build/execute-service-cmd/command-factory.component';
import {ContextAwareCommandExecutorComponent} from './executor/context-aware-command-executor.component';
import {CompositeSimpleCommandExecutorComponent} from './executor/composite-simple-command-executor.component';
import {PathHelper} from './helper/path-helper.component';
import {InstanceContextFactory} from './instance-context-factory.component';
import {EnableProxyDomainsCommandExecutorComponent} from './command/enable-proxy-domains/command-executor.component';
import {CommandsMapExecutorComponent} from './executor/commands-map-executor.component';
import {CommandsListExecutorComponent} from './executor/commands-list-executor.component';
import {CommandExecutorComponent} from './executor/command-executor.component';
import {VariablesPredictor} from './variable/variables-predictor';
import {IpAddressCheckerComponent} from './ip-address-checker.component';
import {DockerVolumeHelperComponent} from "../docker/docker-volume-helper.component";

@Module({
    imports: [
        LoggerModule,
        PersistenceModule,
    ],
    controllers: [],
    providers: [
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
        RunDockerComposeCommandExecutorComponent,
        ExecuteHostCmdCommandExecutorComponent,
        ExecuteServiceCmdCommandExecutorComponent,
        CopyAssetIntoContainerCommandExecutorComponent,
        CreateVolumeFromAssetCommandExecutorComponent,
        CreateVolumeFromSourceCommandExecutorComponent,
        EnableProxyDomainsCommandExecutorComponent,
        ContainerInfoCheckerComponent,
        ContainerStateCheckerComponent,
        IpAddressCheckerComponent,
        InterpolationHelper,
        SpawnHelper,
        PathHelper,
        InstanceCreatorComponent,
        InstanceContextFactory,
        CopyFileCommandFactoryComponent,
        InterpolateFileCommandFactoryComponent,
        CopyAssetIntoContainerCommandFactoryComponent,
        ExecuteHostCmdCommandFactoryComponent,
        ExecuteServiceCmdCommandFactoryComponent,
        CommandExecutorComponent,
        CommandsMapExecutorComponent,
        CommandsListExecutorComponent,
        ContextAwareCommandExecutorComponent,
        CompositeSimpleCommandExecutorComponent,
        VariablesPredictor,
        DockerVolumeHelperComponent,
    ],
    exports: [
        InstanceCreatorComponent,
        ContainerStateCheckerComponent,
        IpAddressCheckerComponent,
        VariablesPredictor,
    ],
})
export class InstantiationModule {}
