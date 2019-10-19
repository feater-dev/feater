import { Injectable } from '@nestjs/common';
import { BaseLogger } from '../logger/base-logger';
import { CommandsList } from './executor/commands-list';
import { ContextAwareCommand } from './executor/context-aware-command.interface';
import { CreateDirectoryCommand } from './command/create-directory/command';
import { CreateAssetVolumeCommand } from './command/create-asset-volume/command';
import { CreateAssetVolumeCommandResultInterface } from './command/create-asset-volume/command-result.interface';
import { CloneSourceCommand } from './command/clone-source/command';
import { ParseDockerComposeCommand } from './command/parse-docker-compose/command';
import { ParseDockerComposeCommandResultInterface } from './command/parse-docker-compose/command-result.interface';
import { PrepareProxyDomainCommand } from './command/prepare-port-domain/command';
import { PrepareProxyDomainCommandResultInterface } from './command/prepare-port-domain/command-result.interface';
import { ConfigureProxyDomainCommand } from './command/configure-proxy-domain/command';
import { ConfigureProxyDomainCommandResultInterface } from './command/configure-proxy-domain/command-result.interface';
import { RunDockerComposeCommand } from './command/run-docker-compose/command';
import { ConnectToNetworkCommand } from './command/connect-containers-to-network/command';
import { GetContainerIdsCommand } from './command/get-container-id/command';
import { GetContainerIdsCommandResultInterface } from './command/get-container-id/command-result.interface';
import { ConnectToNetworkCommandResultInterface } from './command/connect-containers-to-network/command-result.interface';
import { PrepareSummaryItemsCommand } from './command/prepare-summary-items/command';
import { CopyFileCommandFactoryComponent } from './command/before-build/copy-file/command-factory.component';
import { InterpolateFileCommandFactoryComponent } from './command/before-build/interpolate-file/command-factory.component';
import { BeforeBuildTaskCommandFactoryInterface } from './command/before-build/command-factory.interface';
import { CopyAssetIntoContainerCommandFactoryComponent } from './command/after-build/copy-asset-into-container/command-factory.component';
import { ExecuteServiceCmdCommandFactoryComponent } from './command/after-build/execute-service-cmd/command-factory.component';
import { AfterBuildTaskCommandFactoryInterface } from './command/after-build/command-factory.interface';
import { CommandExecutorComponent } from './executor/command-executor.component';
import { PrepareSummaryItemsCommandResultInterface } from './command/prepare-summary-items/command-result.interface';
import { ActionExecutionContextSourceInterface } from './action-execution-context/action-execution-context-source.interface';
import { ActionExecutionContextAfterBuildTaskInterface } from './action-execution-context/after-build/action-execution-context-after-build-task.interface';
import { ActionExecutionContextBeforeBuildTaskInterface } from './action-execution-context/before-build/action-execution-context-before-build-task.interface';
import { ActionExecutionContext } from './action-execution-context/action-execution-context';
import { ActionExecutionContextFactory } from './action-execution-context-factory.component';
import { EnableProxyDomainsCommand } from './command/enable-proxy-domains/command';
import { InstanceRepository } from '../persistence/repository/instance.repository';
import { CommandType } from './executor/command.type';
import { CommandsMap } from './executor/commands-map';
import { CommandsMapItem } from './executor/commands-map-item';
import { InstanceInterface } from '../persistence/interface/instance.interface';
import { DefinitionInterface } from '../persistence/interface/definition.interface';
import { ActionLogRepository } from '../persistence/repository/action-log.repository';
import {
    ActionInterface,
    RecipeInterface,
} from '../api/recipe/recipe.interface';
import { RecipeMapper } from '../api/recipe/schema-version/0-1/recipe-mapper';
import { CreateSourceVolumeCommand } from './command/create-source-volume/command';
import { RemoveVolumeCommand } from './command/remove-source-volume/command';
import { CreateSourceVolumeCommandResultInterface } from './command/create-source-volume/command-result.interface';
import { RemoveSourceCommand } from './command/remove-source/command';
import * as _ from 'lodash';

@Injectable()
export class Instantiator {
    private readonly beforeBuildTaskCommandFactoryComponents: BeforeBuildTaskCommandFactoryInterface[];
    private readonly afterBuildTaskCommandFactoryComponents: AfterBuildTaskCommandFactoryInterface[];

    constructor(
        private readonly instanceRepository: InstanceRepository,
        private readonly actionLogRepository: ActionLogRepository,
        private readonly actionExecutionContextFactory: ActionExecutionContextFactory,
        private readonly logger: BaseLogger,
        private readonly commandExecutorComponent: CommandExecutorComponent,
        private readonly recipeMapper: RecipeMapper,
        copyFileCommandFactoryComponent: CopyFileCommandFactoryComponent,
        interpolateFileCommandFactoryComponent: InterpolateFileCommandFactoryComponent,
        copyAssetIntoContainerCommandFactoryComponent: CopyAssetIntoContainerCommandFactoryComponent,
        executeServiceCmdCommandFactoryComponent: ExecuteServiceCmdCommandFactoryComponent,
    ) {
        this.beforeBuildTaskCommandFactoryComponents = [
            copyFileCommandFactoryComponent,
            interpolateFileCommandFactoryComponent,
        ];

        this.afterBuildTaskCommandFactoryComponents = [
            copyAssetIntoContainerCommandFactoryComponent,
            executeServiceCmdCommandFactoryComponent,
        ];
    }

    async createInstance(
        definition: DefinitionInterface,
        instanceHash: string,
        instantiationActionId: string,
        instance: InstanceInterface,
    ): Promise<unknown> {
        const recipe = this.recipeMapper.map(definition.recipeAsYaml);

        const action = this.findAction(recipe, instantiationActionId);

        const instanceId = instance._id.toString();

        const actionLog = await this.actionLogRepository.create(
            instanceId,
            action.id,
            action.type,
            action.name,
        );

        const actionLogId = actionLog._id.toString();

        const actionExecutionContext = this.actionExecutionContextFactory.create(
            instanceId,
            instanceHash,
            action.id,
            recipe,
        );

        const createInstanceCommand = new CommandsList([], false);

        const updateInstance = async (): Promise<void> => {
            instance.hash = actionExecutionContext.hash;
            instance.assetVolumes = actionExecutionContext.assetVolumes.map(
                assetVolume => ({
                    id: assetVolume.id,
                    dockerVolumeName: assetVolume.dockerVolumeName,
                }),
            );
            instance.sourceVolumes = actionExecutionContext.sourceVolumes.map(
                sourceVolume => ({
                    id: sourceVolume.id,
                    dockerVolumeName: sourceVolume.dockerVolumeName,
                }),
            );
            instance.envVariables = actionExecutionContext.envVariables.toList();
            instance.featerVariables = actionExecutionContext.featerVariables.toList();
            instance.services = _.cloneDeep(actionExecutionContext.services);
            instance.proxiedPorts = _.cloneDeep(
                actionExecutionContext.proxiedPorts,
            );
            instance.downloadables = _.cloneDeep(
                actionExecutionContext.downloadables,
            );
            instance.summaryItems = actionExecutionContext.summaryItems.toList();

            await this.instanceRepository.save(instance);
        };

        await updateInstance();

        const addStageArguments = [
            createInstanceCommand,
            actionLogId,
            actionExecutionContext,
            updateInstance,
        ];

        const addStageMethods = [
            this.addCreateDirectory,
            this.addCreateVolumeFromAssetsAndCloneSource,
            this.addCreateComposeVolumes,
            this.addParseDockerCompose,
            this.addRemoveComposeVolumes,
            this.addPrepareProxyDomains,
            this.addPrepareSummaryItems,
            this.addBeforeBuildTasks,
            this.addCreateAllSourceVolumes,
            this.addRemoveSources,
            this.addRunDockerCompose,
            this.addGetContainerIds,
            this.addConnectContainersToNetwork,
            this.addConfigureProxyDomains,
            this.addAfterBuildTasks,
            this.addEnableProxyDomains,
        ];

        for (const addStageMethod of addStageMethods) {
            addStageMethod.apply(this, addStageArguments);
        }

        return this.commandExecutorComponent
            .execute(createInstanceCommand)
            .then(
                async (): Promise<void> => {
                    this.logger.info('Instance creation completed.');
                    actionLog.completedAt = new Date();
                    await actionLog.save();
                    instance.completedAt = new Date();
                    await instance.save();
                },
                async (error: Error): Promise<void> => {
                    this.logger.error('Instance creation failed.');
                    actionLog.failedAt = new Date();
                    await actionLog.save();
                    instance.failedAt = new Date();
                    await instance.save();
                },
            );
    }

    private addCreateDirectory(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                actionLogId,
                actionExecutionContext.id,
                actionExecutionContext.hash,
                `Create instance build directory`,
                () =>
                    new CreateDirectoryCommand(
                        actionExecutionContext.paths.dir.absolute.guest,
                    ),
            ),
        );
    }

    private addCreateVolumeFromAssetsAndCloneSource(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        const createVolumeFromAssetCommands = actionExecutionContext.assetVolumes.map(
            assetVolume =>
                new ContextAwareCommand(
                    actionLogId,
                    actionExecutionContext.id,
                    actionExecutionContext.hash,
                    `Create asset volume \`${assetVolume.id}\``,
                    () => {
                        return new CreateAssetVolumeCommand(
                            assetVolume.id,
                            assetVolume.dockerVolumeName,
                            actionExecutionContext.paths.dir.absolute.guest,
                            assetVolume.assetId,
                        );
                    },
                    async (
                        result: CreateAssetVolumeCommandResultInterface,
                    ): Promise<void> => {
                        actionExecutionContext.mergeEnvVariablesSet(
                            result.envVariables,
                        );
                        actionExecutionContext.mergeFeaterVariablesSet(
                            result.featerVariables,
                        );
                        await updateInstance();
                    },
                ),
        );

        const cloneSourceCommands = actionExecutionContext.sources.map(
            source =>
                new ContextAwareCommand(
                    actionLogId,
                    actionExecutionContext.id,
                    actionExecutionContext.hash,
                    `Clone repository for source \`${source.id}\``,
                    () =>
                        new CloneSourceCommand(
                            source.cloneUrl,
                            source.useDeployKey,
                            source.reference.type,
                            source.reference.name,
                            source.paths.absolute.guest,
                            source.paths.absolute.guest, // TODO Replace with working directory.
                        ),
                ),
        );

        createInstanceCommand.addCommand(
            new CommandsList(
                createVolumeFromAssetCommands.concat(cloneSourceCommands),
                true,
            ),
        );
    }

    private addCreateComposeVolumes(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        const composeFile = actionExecutionContext.composeFiles[0];
        const source = actionExecutionContext.findSource(composeFile.sourceId);

        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                actionLogId,
                actionExecutionContext.id,
                actionExecutionContext.hash,
                `Create compose volume.`,
                () =>
                    new CreateSourceVolumeCommand(
                        composeFile.dockerVolumeName,
                        source.id,
                        source.paths.absolute.guest,
                        source.paths.absolute.guest,
                        null,
                        null,
                    ),
            ),
        );
    }

    /**
     * This stage will detect what services are available and will detect container prefix
     * names they should be assigned.
     */
    private addParseDockerCompose(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                actionLogId,
                actionExecutionContext.id,
                actionExecutionContext.hash,
                `Parse compose configuration`,
                () => {
                    const composeFile = actionExecutionContext.composeFiles[0];
                    const source = actionExecutionContext.findSource(
                        composeFile.sourceId,
                    );

                    return new ParseDockerComposeCommand(
                        composeFile.dockerVolumeName,
                        composeFile.envDirRelativePath,
                        composeFile.composeFileRelativePaths,
                        actionExecutionContext.envVariables,
                        actionExecutionContext.composeProjectName,
                        actionExecutionContext.paths.dir.absolute.guest,
                    );
                },
                async (
                    result: ParseDockerComposeCommandResultInterface,
                ): Promise<void> => {
                    for (const service of result.services) {
                        actionExecutionContext.services.push({
                            id: service.id,
                            containerNamePrefix: service.containerNamePrefix,
                        });
                    }
                },
            ),
        );
    }

    private addRemoveComposeVolumes(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        const composeFile = actionExecutionContext.composeFiles[0];
        const source = actionExecutionContext.findSource(composeFile.sourceId);

        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                actionLogId,
                actionExecutionContext.id,
                actionExecutionContext.hash,
                `Remove compose volume.`,
                () =>
                    new RemoveVolumeCommand(
                        composeFile.dockerVolumeName,
                        source.paths.absolute.guest,
                    ),
            ),
        );
    }

    /**
     * Proxy domain is generated for each proxied port so that it will be available for interpolation
     * inside before build tasks and in env variables when docker-compose setup is run.
     */
    private addPrepareProxyDomains(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                actionExecutionContext.proxiedPorts.map(
                    proxiedPort =>
                        new ContextAwareCommand(
                            actionLogId,
                            actionExecutionContext.id,
                            actionExecutionContext.hash,
                            `Prepare domain for proxied port \`${proxiedPort.id}\``,
                            () =>
                                new PrepareProxyDomainCommand(
                                    actionExecutionContext.hash,
                                    proxiedPort.id,
                                ),
                            async (
                                result: PrepareProxyDomainCommandResultInterface,
                            ): Promise<void> => {
                                proxiedPort.domain = result.proxyDomain;
                                actionExecutionContext.mergeEnvVariablesSet(
                                    result.envVariables,
                                );
                                actionExecutionContext.mergeFeaterVariablesSet(
                                    result.featerVariables,
                                );
                                await updateInstance();
                            },
                        ),
                ),
                true,
            ),
        );
    }

    private addPrepareSummaryItems(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                actionLogId,
                actionExecutionContext.id,
                actionExecutionContext.hash,
                `Prepare summary items`,
                () =>
                    new PrepareSummaryItemsCommand(
                        actionExecutionContext.featerVariables,
                        actionExecutionContext.nonInterpolatedSummaryItems,
                    ),
                async (
                    result: PrepareSummaryItemsCommandResultInterface,
                ): Promise<void> => {
                    actionExecutionContext.summaryItems = result.summaryItems;
                    await updateInstance();
                },
            ),
        );
    }

    // TODO Extract to a separate service.
    private addBeforeBuildTasks(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                actionExecutionContext.sources.map(
                    source =>
                        new CommandsList(
                            source.beforeBuildTasks.map(beforeBuildTask =>
                                this.createBeforeBuildTaskCommand(
                                    beforeBuildTask,
                                    source,
                                    actionLogId,
                                    actionExecutionContext,
                                    updateInstance,
                                ),
                            ),
                            false,
                        ),
                ),
                true,
            ),
        );
    }

    private addCreateAllSourceVolumes(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                actionExecutionContext.sourceVolumes.map(sourceVolume => {
                    const source = actionExecutionContext.findSource(
                        sourceVolume.sourceId,
                    );

                    return new ContextAwareCommand(
                        actionLogId,
                        actionExecutionContext.id,
                        actionExecutionContext.hash,
                        `Create source volume \`${sourceVolume.id}\``,
                        () =>
                            new CreateSourceVolumeCommand(
                                sourceVolume.dockerVolumeName,
                                source.id,
                                source.paths.absolute.guest,
                                source.paths.absolute.guest,
                                sourceVolume.relativePath,
                                sourceVolume.id,
                            ),
                        async (
                            result: CreateSourceVolumeCommandResultInterface,
                        ): Promise<void> => {
                            actionExecutionContext.mergeEnvVariablesSet(
                                result.envVariables,
                            );
                            actionExecutionContext.mergeFeaterVariablesSet(
                                result.featerVariables,
                            );
                            await updateInstance();
                        },
                    );
                }),
            ),
        );
    }

    private addRemoveSources(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                actionExecutionContext.sources.map(
                    source =>
                        new ContextAwareCommand(
                            actionLogId,
                            actionExecutionContext.id,
                            actionExecutionContext.hash,
                            `Remove source \`${source.id}\``,
                            () =>
                                new RemoveSourceCommand(
                                    source.id,
                                    source.paths.absolute.guest,
                                ),
                        ),
                ),
            ),
        );
    }

    private addRunDockerCompose(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                actionLogId,
                actionExecutionContext.id,
                actionExecutionContext.hash,
                `Run docker-compose`,
                () => {
                    const composeFile = actionExecutionContext.composeFiles[0];
                    const source = actionExecutionContext.findSource(
                        composeFile.sourceId,
                    );

                    return new RunDockerComposeCommand(
                        source.dockerVolumeName,
                        composeFile.envDirRelativePath,
                        composeFile.composeFileRelativePaths,
                        actionExecutionContext.envVariables,
                        actionExecutionContext.paths.dir.absolute.guest,
                    );
                },
            ),
        );
    }

    /**
     * When docker-compose setup is run it's possible to inspect containers and retrieve their ids
     * which will be needed to provide proxy domain for specified ports.
     */
    private addGetContainerIds(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                actionLogId,
                actionExecutionContext.id,
                actionExecutionContext.hash,
                `Get container ids`,
                () =>
                    new GetContainerIdsCommand(
                        actionExecutionContext.composeProjectName,
                        actionExecutionContext.services.map(service => ({
                            serviceId: service.id,
                            containerNamePrefix: service.containerNamePrefix,
                        })),
                    ),
                async (
                    result: GetContainerIdsCommandResultInterface,
                ): Promise<void> => {
                    for (const {
                        serviceId,
                        containerId,
                    } of result.serviceContainerIds) {
                        const service = actionExecutionContext.findService(
                            serviceId,
                        );
                        service.containerId = containerId;
                    }
                    actionExecutionContext.mergeEnvVariablesSet(
                        result.envVariables,
                    );
                    actionExecutionContext.mergeFeaterVariablesSet(
                        result.featerVariables,
                    );
                    await updateInstance();
                },
            ),
        );
    }

    /**
     * All containers which have some ports exposed are connected to a separate network together with
     * Nginx container that will handle configurations for their proxy domains.
     */
    private addConnectContainersToNetwork(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                actionExecutionContext.proxiedPorts.map(
                    proxiedPort =>
                        new ContextAwareCommand(
                            actionLogId,
                            actionExecutionContext.id,
                            actionExecutionContext.hash,
                            `Connect service \`${proxiedPort.serviceId}\` to proxy network`,
                            () => {
                                const service = actionExecutionContext.findService(
                                    proxiedPort.serviceId,
                                );

                                return new ConnectToNetworkCommand(
                                    service.id,
                                    service.containerId,
                                );
                            },
                            async (
                                result: ConnectToNetworkCommandResultInterface,
                            ): Promise<void> => {
                                const service = actionExecutionContext.findService(
                                    proxiedPort.serviceId,
                                );
                                service.ipAddress = result.ipAddress;
                            },
                        ),
                ),
                true,
            ),
        );
    }

    private addConfigureProxyDomains(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                actionExecutionContext.proxiedPorts.map(
                    proxiedPort =>
                        new ContextAwareCommand(
                            actionLogId,
                            actionExecutionContext.id,
                            actionExecutionContext.hash,
                            `Prepare configuration for proxied port \`${proxiedPort.id}\``,
                            () => {
                                const service = actionExecutionContext.findService(
                                    proxiedPort.serviceId,
                                );

                                return new ConfigureProxyDomainCommand(
                                    proxiedPort.serviceId,
                                    service.ipAddress,
                                    proxiedPort.port,
                                    proxiedPort.domain,
                                    proxiedPort.nginxConfigTemplate,
                                );
                            },
                            async (
                                result: ConfigureProxyDomainCommandResultInterface,
                            ): Promise<void> => {
                                proxiedPort.nginxConfig = result.nginxConfig;
                            },
                        ),
                ),
                true,
            ),
        );
    }

    // TODO Extract to a separate service.
    private addAfterBuildTasks(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        const commandMapItems: CommandsMapItem[] = actionExecutionContext.afterBuildTasks.map(
            (afterBuildTask): CommandsMapItem => {
                const command = this.createAfterBuildTaskCommand(
                    afterBuildTask,
                    actionLogId,
                    actionExecutionContext,
                    updateInstance,
                );

                return new CommandsMapItem(
                    command,
                    afterBuildTask.id,
                    afterBuildTask.dependsOn || [],
                );
            },
        );

        createInstanceCommand.addCommand(new CommandsMap(commandMapItems));
    }

    private addEnableProxyDomains(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                actionLogId,
                actionExecutionContext.id,
                actionExecutionContext.hash,
                `Enable configuration for proxied ports`,
                () =>
                    new EnableProxyDomainsCommand(
                        actionExecutionContext.hash,
                        actionExecutionContext.proxiedPorts.map(
                            proxiedPort => proxiedPort.nginxConfig,
                        ),
                    ),
            ),
        );
    }

    // TODO Extract to a separate service.
    private createBeforeBuildTaskCommand(
        beforeBuildTask: ActionExecutionContextBeforeBuildTaskInterface,
        source: ActionExecutionContextSourceInterface,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): CommandType {
        for (const factory of this.beforeBuildTaskCommandFactoryComponents) {
            if (factory.supportsType(beforeBuildTask.type)) {
                return factory.createCommand(
                    beforeBuildTask.type,
                    beforeBuildTask,
                    source,
                    actionLogId,
                    actionExecutionContext,
                    updateInstance,
                );
            }
        }

        throw new Error(
            `Unknown type of before build task ${beforeBuildTask.type} for source ${source.id}.`,
        );
    }

    // TODO Extract to a separate service.
    private createAfterBuildTaskCommand(
        afterBuildTask: ActionExecutionContextAfterBuildTaskInterface,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): CommandType {
        for (const factory of this.afterBuildTaskCommandFactoryComponents) {
            if (factory.supportsType(afterBuildTask.type)) {
                return factory.createCommand(
                    afterBuildTask.type,
                    afterBuildTask,
                    actionLogId,
                    actionExecutionContext,
                    updateInstance,
                );
            }
        }

        throw new Error(
            `Unknown type of after build task ${afterBuildTask.type}.`,
        );
    }

    private findAction(
        recipe: RecipeInterface,
        actionId: string,
    ): ActionInterface {
        for (const action of recipe.actions) {
            if ('instantiation' === action.type && actionId === action.id) {
                return action;
            }
        }

        throw new Error(`Invalid instantiation action '${actionId}'.`);
    }
}
