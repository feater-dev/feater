import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { PersistenceModule } from '../persistence/persistence.module';
import { InterpolationHelper } from './helper/interpolation-helper.component';
import { ContainerStateCheckerComponent } from './container-state-checker-component.service';
import { SpawnHelper } from './helper/spawn-helper.component';
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
    CopyFileCommandFactoryComponent,
    InterpolateFileCommandFactoryComponent,
    CopyAssetIntoContainerCommandFactoryComponent,
    ExecuteServiceCmdCommandFactoryComponent,
    EnableProxyDomainsCommandExecutorComponent,
} from './command';
import { ContextAwareCommandExecutorComponent } from './executor/context-aware-command-executor.component';
import { CompositeSimpleCommandExecutorComponent } from './executor/composite-simple-command-executor.component';
import { PathHelper } from './helper/path-helper.component';
import { ActionExecutionContextFactory } from './action-execution-context-factory.component';
import { CommandsMapExecutorComponent } from './executor/commands-map-executor.component';
import { CommandsListExecutorComponent } from './executor/commands-list-executor.component';
import { CommandExecutorComponent } from './executor/command-executor.component';
import { VariablesPredictor } from './variable/variables-predictor';
import { IpAddressCheckerComponent } from './ip-address-checker.component';
import { DockerVolumeHelperComponent } from './docker/docker-volume-helper.component';
import { HelperModule } from '../helper/helper.module';
import { Modificator } from './modificator.service';
import { Instantiator } from './instantiator.service';
import { ContainerInfoChecker } from './container-info-checker-component.service';
import { RecipeMapper } from '../api/recipe/schema-version/0-1/recipe-mapper'; // TODO Move from `api` module to `instantiation` module.
import { RecipeValidator } from '../api/recipe/schema-version/0-1/recipe-validator'; // TODO Move from `api` module to `instantiation` module.
import { RecipePartMapper } from '../api/recipe/schema-version/0-1/recipe-part-mapper'; // TODO Move from `api` module to `instantiation` module.
import { RecipeSchemaVersionExtractor } from '../api/recipe/recipe-schema-version-extractor'; // TODO Move from `api` module to `instantiation` module.

@Module({
    imports: [HelperModule, LoggerModule, PersistenceModule],
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
        ResetSourceCommandExecutorComponent,
        RunDockerComposeCommandExecutorComponent,
        ExecuteServiceCmdCommandExecutorComponent,
        CopyAssetIntoContainerCommandExecutorComponent,
        CreateAssetVolumeCommandExecutorComponent,
        EnableProxyDomainsCommandExecutorComponent,
        ContainerInfoChecker,
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
        RecipeSchemaVersionExtractor,
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
