import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { PersistenceModule } from '../persistence/persistence.module';
import { InterpolationHelper } from './helper/interpolation-helper.component';
import { ContainerStateCheckerComponent } from './container-state-checker-component.service';
import { ContainerInfoCheckerComponent } from './container-info-checker-component.service';
import { SpawnHelper } from './helper/spawn-helper.component';
import { ConnectToNetworkCommandExecutorComponent } from './command/connect-containers-to-network/command-executor.component';
import { CopyFileCommandExecutorComponent } from './command/before-build/copy-file/command-executor.component';
import { CreateDirectoryCommandExecutorComponent } from './command/create-directory/command-executor.component';
import { CloneSourceCommandExecutorComponent } from './command/clone-source/command-executor.component';
import { GetContainerIdsCommandExecutorComponent } from './command/get-container-id/command-executor.component';
import { InterpolateFileCommandExecutorComponent } from './command/before-build/interpolate-file/command-executor.component';
import { ParseDockerComposeCommandExecutorComponent } from './command/parse-docker-compose/command-executor.component';
import { PrepareProxyDomainCommandExecutorComponent } from './command/prepare-port-domain/command-executor.component';
import { ConfigureProxyDomainCommandExecutorComponent } from './command/configure-proxy-domain/command-executor.component';
import { PrepareSummaryItemsCommandExecutorComponent } from './command/prepare-summary-items/command-executor.component';
import { RunDockerComposeCommandExecutorComponent } from './command/run-docker-compose/command-executor.component';
import { ExecuteServiceCmdCommandExecutorComponent } from './command/after-build/execute-service-cmd/command-executor.component';
import { CopyAssetIntoContainerCommandExecutorComponent } from './command/after-build/copy-asset-into-container/command-executor.component';
import { CreateAssetVolumeCommandExecutorComponent } from './command/create-asset-volume/command-executor.component';
import { CreateSourceVolumeCommandExecutorComponent } from './command/create-source-volume/command-executor.component';
import { RemoveVolumeCommandExecutorComponent } from './command/remove-source-volume/command-executor.component';
import { CopyFileCommandFactoryComponent } from './command/before-build/copy-file/command-factory.component';
import { InterpolateFileCommandFactoryComponent } from './command/before-build/interpolate-file/command-factory.component';
import { CopyAssetIntoContainerCommandFactoryComponent } from './command/after-build/copy-asset-into-container/command-factory.component';
import { ExecuteServiceCmdCommandFactoryComponent } from './command/after-build/execute-service-cmd/command-factory.component';
import { ContextAwareCommandExecutorComponent } from './executor/context-aware-command-executor.component';
import { CompositeSimpleCommandExecutorComponent } from './executor/composite-simple-command-executor.component';
import { PathHelper } from './helper/path-helper.component';
import { ActionExecutionContextFactory } from './action-execution-context-factory.component';
import { EnableProxyDomainsCommandExecutorComponent } from './command/enable-proxy-domains/command-executor.component';
import { CommandsMapExecutorComponent } from './executor/commands-map-executor.component';
import { CommandsListExecutorComponent } from './executor/commands-list-executor.component';
import { CommandExecutorComponent } from './executor/command-executor.component';
import { VariablesPredictor } from './variable/variables-predictor';
import { IpAddressCheckerComponent } from './ip-address-checker.component';
import { DockerVolumeHelperComponent } from './docker/docker-volume-helper.component';
import { RemoveSourceCommandExecutorComponent } from './command/remove-source/command-executor.component';
import { HelperModule } from '../helper/helper.module';
import { RecipeMapper } from '../api/recipe/schema-version/0-1/recipe-mapper';
import { RecipeValidator } from '../api/recipe/schema-version/0-1/recipe-validator';
import { RecipePartMapper } from '../api/recipe/schema-version/0-1/recipe-part-mapper';
import { Modificator } from './modificator.service';
import { Instantiator } from './instantiator.service';

@Module({
    imports: [HelperModule, LoggerModule, PersistenceModule],
    controllers: [],
    providers: [
        ConnectToNetworkCommandExecutorComponent,
        CopyFileCommandExecutorComponent,
        CreateDirectoryCommandExecutorComponent,
        CloneSourceCommandExecutorComponent,
        RemoveSourceCommandExecutorComponent,
        GetContainerIdsCommandExecutorComponent,
        InterpolateFileCommandExecutorComponent,
        ParseDockerComposeCommandExecutorComponent,
        PrepareProxyDomainCommandExecutorComponent,
        ConfigureProxyDomainCommandExecutorComponent,
        PrepareSummaryItemsCommandExecutorComponent,
        RunDockerComposeCommandExecutorComponent,
        ExecuteServiceCmdCommandExecutorComponent,
        CopyAssetIntoContainerCommandExecutorComponent,
        CreateAssetVolumeCommandExecutorComponent,
        CreateSourceVolumeCommandExecutorComponent,
        RemoveVolumeCommandExecutorComponent,
        EnableProxyDomainsCommandExecutorComponent,
        ContainerInfoCheckerComponent,
        ContainerStateCheckerComponent,
        IpAddressCheckerComponent,
        InterpolationHelper,
        SpawnHelper,
        PathHelper,
        ActionExecutionContextFactory,
        CopyFileCommandFactoryComponent,
        InterpolateFileCommandFactoryComponent,
        CopyAssetIntoContainerCommandFactoryComponent,
        ExecuteServiceCmdCommandFactoryComponent,
        CommandExecutorComponent,
        CommandsMapExecutorComponent,
        CommandsListExecutorComponent,
        ContextAwareCommandExecutorComponent,
        CompositeSimpleCommandExecutorComponent,
        VariablesPredictor,
        DockerVolumeHelperComponent,
        RecipeMapper,
        RecipePartMapper,
        RecipeValidator,
        Instantiator,
        Modificator,
    ],
    exports: [
        ContainerStateCheckerComponent,
        IpAddressCheckerComponent,
        PathHelper,
        VariablesPredictor,
        RecipeMapper,
        RecipeValidator,
        Instantiator,
        Modificator,
    ],
})
export class InstantiationModule {}
