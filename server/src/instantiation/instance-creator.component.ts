import * as _ from 'lodash';
import {Injectable} from '@nestjs/common';
import {BaseLogger} from '../logger/base-logger';
import {CommandsList} from './executor/commands-list';
import {ContextAwareCommand} from './executor/context-aware-command.interface';
import {CreateDirectoryCommand} from './command/create-directory/command';
import {CreateAssetVolumeCommand} from './command/create-asset-volume/command';
import {CreateAssetVolumeCommandResultInterface} from './command/create-asset-volume/command-result.interface';
import {CloneSourceCommand} from './command/clone-source/command';
import {ParseDockerComposeCommand} from './command/parse-docker-compose/command';
import {ParseDockerComposeCommandResultInterface} from './command/parse-docker-compose/command-result.interface';
import {PrepareProxyDomainCommand} from './command/prepare-port-domain/command';
import {PrepareProxyDomainCommandResultInterface} from './command/prepare-port-domain/command-result.interface';
import {ConfigureProxyDomainCommand} from './command/configure-proxy-domain/command';
import {ConfigureProxyDomainCommandResultInterface} from './command/configure-proxy-domain/command-result.interface';
import {RunDockerComposeCommand} from './command/run-docker-compose/command';
import {ConnectToNetworkCommand} from './command/connect-containers-to-network/command';
import {GetContainerIdsCommand} from './command/get-container-id/command';
import {GetContainerIdsCommandResultInterface} from './command/get-container-id/command-result.interface';
import {ConnectToNetworkCommandResultInterface} from './command/connect-containers-to-network/command-result.interface';
import {PrepareSummaryItemsCommand} from './command/prepare-summary-items/command';
import {CopyFileCommandFactoryComponent} from './command/before-build/copy-file/command-factory.component';
import {InterpolateFileCommandFactoryComponent} from './command/before-build/interpolate-file/command-factory.component';
import {BeforeBuildTaskCommandFactoryInterface} from './command/before-build/command-factory.interface';
import {CopyAssetIntoContainerCommandFactoryComponent} from './command/after-build/copy-asset-into-container/command-factory.component';
import {ExecuteServiceCmdCommandFactoryComponent} from './command/after-build/execute-service-cmd/command-factory.component';
import {AfterBuildTaskCommandFactoryInterface} from './command/after-build/command-factory.interface';
import {CommandExecutorComponent} from './executor/command-executor.component';
import {PrepareSummaryItemsCommandResultInterface} from './command/prepare-summary-items/command-result.interface';
import {InstanceContextSourceInterface} from './instance-context/instance-context-source.interface';
import {InstanceContextAfterBuildTaskInterface} from './instance-context/after-build/instance-context-after-build-task.interface';
import {InstanceContextBeforeBuildTaskInterface} from './instance-context/before-build/instance-context-before-build-task.interface';
import {InstanceContext} from './instance-context/instance-context';
import {InstanceContextFactory} from './instance-context-factory.component';
import {EnableProxyDomainsCommand} from './command/enable-proxy-domains/command';
import {InstanceRepository} from '../persistence/repository/instance.repository';
import {CommandType} from './executor/command.type';
import {CommandsMap} from './executor/commands-map';
import {CommandsMapItem} from './executor/commands-map-item';
import {InstanceInterface} from '../persistence/interface/instance.interface';
import {DefinitionInterface} from '../persistence/interface/definition.interface';
import {CreateSourceVolumeCommand} from "./command/create-source-volume/command";
import {RemoveSourceVolumeCommand} from "./command/remove-source-volume/command";
import {RemoveSourceCommand} from "./command/remove-source/command";
import {CreateSourceVolumeCommandResultInterface} from "./command/create-source-volume/command-result.interface";

@Injectable()
export class InstanceCreatorComponent {

    protected readonly beforeBuildTaskCommandFactoryComponents: BeforeBuildTaskCommandFactoryInterface[];
    protected readonly afterBuildTaskCommandFactoryComponents: AfterBuildTaskCommandFactoryInterface[];

    constructor(
        protected readonly instanceRepository: InstanceRepository,
        protected readonly instanceContextFactory: InstanceContextFactory,
        protected readonly logger: BaseLogger,
        protected readonly commandExecutorComponent: CommandExecutorComponent,
        protected readonly copyFileCommandFactoryComponent: CopyFileCommandFactoryComponent,
        protected readonly interpolateFileCommandFactoryComponent: InterpolateFileCommandFactoryComponent,
        protected readonly copyAssetIntoContainerCommandFactoryComponent: CopyAssetIntoContainerCommandFactoryComponent,
        protected readonly executeServiceCmdCommandFactoryComponent: ExecuteServiceCmdCommandFactoryComponent,
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
        instance: InstanceInterface,
        hash: string,
        definition: DefinitionInterface,
    ): Promise<any> {
        const {config: definitionConfig} = definition;
        const id = instance.id;
        const taskId = 'instance_creation';
        const instanceContext = this.instanceContextFactory.create(id, hash, definitionConfig);

        const createInstanceCommand = new CommandsList([], false);

        const updateInstance = async (): Promise<void> => {
            instance.hash = instanceContext.hash;
            instance.envVariables = instanceContext.envVariables.toList();
            instance.summaryItems = instanceContext.summaryItems.toList();
            instance.services = _.cloneDeep(instanceContext.services);
            instance.proxiedPorts = _.cloneDeep(instanceContext.proxiedPorts);
            // TODO Handle feature variables.
            // TODO Handle volumes.

            await this.instanceRepository.save(instance);
        };

        await updateInstance();

        const addStageArguments = [createInstanceCommand, taskId, instanceContext, updateInstance];

        const addStageMethods = [
            this.addCreateDirectory,
            this.addCreateVolumeFromAssetsAndCloneSource,
            this.addCreateComposeSourceVolumes,
            this.addParseDockerCompose,
            this.addRemoveComposeSourceVolumes,
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
                    this.logger.info('Build instantiated and started.');
                    instance.completedAt = new Date();
                    await updateInstance();
                },
                async (error: Error): Promise<void> => {
                    this.logger.error('Failed to instantiate and start build.');
                    instance.failedAt = new Date();
                    await updateInstance();
                },
            );
    }

    protected addCreateDirectory(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(new ContextAwareCommand(
            taskId,
            instanceContext.id,
            `Create instance build directory`,
            () => new CreateDirectoryCommand(
                instanceContext.paths.dir.absolute.guest,
            ),
        ));
    }

    protected addCreateVolumeFromAssetsAndCloneSource(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        const createVolumeFromAssetCommands = instanceContext.volumes.map(
            volume => new ContextAwareCommand(
                taskId,
                instanceContext.id,
                `Create asset volume \`${volume.id}\``,
                () => {
                    return new CreateAssetVolumeCommand(
                        volume.id,
                        instanceContext.composeProjectName,
                        instanceContext.paths.dir.absolute.guest,
                        volume.assetId,
                    );
                },
                async (result: CreateAssetVolumeCommandResultInterface): Promise<void> => {
                    volume.volume.name = result.dockerVolumeName;
                    instanceContext.mergeEnvVariablesSet(result.envVariables);
                    instanceContext.mergeFeaterVariablesSet(result.featerVariables);
                    await updateInstanceFromInstanceContext();
                },
            ),
        );

        const cloneSourceCommands = instanceContext.sources.map(
            source => new ContextAwareCommand(
                taskId,
                instanceContext.id,
                `Clone repository for source \`${source.id}\``,
                () => new CloneSourceCommand(
                    source.cloneUrl,
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

    /**
     * This stage will detect what services are available and will detect container prefix
     * names they should be assigned.
     */
    protected addParseDockerCompose(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                taskId,
                instanceContext.id,
                `Parse compose configuration`,
                () => {
                    const composeFile = instanceContext.composeFiles[0];
                    const source = instanceContext.findSource(composeFile.sourceId);

                    return new ParseDockerComposeCommand(
                        source.volume.name,
                        composeFile.envDirRelativePath,
                        composeFile.composeFileRelativePaths,
                        instanceContext.envVariables,
                        instanceContext.composeProjectName,
                        instanceContext.paths.dir.absolute.guest,
                    );
                },
                async (result: ParseDockerComposeCommandResultInterface): Promise<void> => {
                    for (const service of result.services) {
                        instanceContext.services.push({
                            id: service.id,
                            containerNamePrefix: service.containerNamePrefix,
                        });
                    }
                },
            ),
        );
    }

    /**
     * Proxy domain is generated for each proxied port so that it will be available for interpolation
     * inside before build tasks and in env variables when docker-compose setup is run.
     */
    protected addPrepareProxyDomains(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                instanceContext.proxiedPorts.map(
                    proxiedPort => new ContextAwareCommand(
                        taskId,
                        instanceContext.id,
                        `Prepare domain for proxied port \`${proxiedPort.id}\``,
                        () => new PrepareProxyDomainCommand(
                            instanceContext.hash,
                            proxiedPort.id,
                        ),
                        async (result: PrepareProxyDomainCommandResultInterface): Promise<void> => {
                            proxiedPort.domain = result.proxyDomain;
                            instanceContext.mergeEnvVariablesSet(result.envVariables);
                            instanceContext.mergeFeaterVariablesSet(result.featerVariables);
                            await updateInstanceFromInstanceContext();
                        },
                    ),
                ),
                true,
            ),
        );
    }

    protected addPrepareSummaryItems(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                taskId,
                instanceContext.id,
                `Prepare summary items`,
                () => new PrepareSummaryItemsCommand(
                    instanceContext.featerVariables,
                    instanceContext.nonInterpolatedSummaryItems,
                ),
                async (result: PrepareSummaryItemsCommandResultInterface): Promise<void> => {
                    instanceContext.summaryItems = result.summaryItems;
                    await updateInstanceFromInstanceContext();
                },
            ),
        );
    }

    protected addBeforeBuildTasks(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                instanceContext.sources.map(
                    source => new CommandsList(
                        source.beforeBuildTasks.map(
                            beforeBuildTask => this.createBeforeBuildTaskCommand(
                                beforeBuildTask,
                                source,
                                taskId,
                                instanceContext,
                                updateInstanceFromInstanceContext,
                            ),
                        ),
                        false,
                    ),
                ),
                true,
            ),
        );
    }

    protected addCreateComposeSourceVolumes(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        const composeFile = instanceContext.composeFiles[0];
        const source = instanceContext.findSource(composeFile.sourceId);

        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                taskId,
                instanceContext.id,
                `Create source volume \`${source.id}\``,
                () => new CreateSourceVolumeCommand(
                    source.id,
                    source.volume.name,
                    source.paths.absolute.guest,
                    source.paths.absolute.guest,
                ),
            ),
        );
    }

    protected addRemoveComposeSourceVolumes(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        const composeFile = instanceContext.composeFiles[0];
        const source = instanceContext.findSource(composeFile.sourceId);

        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                taskId,
                instanceContext.id,
                `Remove source volume \`${source.id}\``,
                () => new RemoveSourceVolumeCommand(
                    source.id,
                    source.volume.name,
                    source.paths.absolute.guest,
                ),
                async (): Promise<void> => {
                    delete source.volume.mountpoint;
                    await updateInstanceFromInstanceContext();
                },
            ),
        );
    }

    protected addCreateAllSourceVolumes(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                instanceContext.sources.map(
                    source => new ContextAwareCommand(
                        taskId,
                        instanceContext.id,
                        `Create source volume \`${source.id}\``,
                        () => new CreateSourceVolumeCommand(
                            source.id,
                            source.volume.name,
                            source.paths.absolute.guest,
                            source.paths.absolute.guest,
                        ),
                        async (result: CreateSourceVolumeCommandResultInterface): Promise<void> => {
                            source.volume.mountpoint = result.sourceVolumeMountpoint;
                            instanceContext.mergeEnvVariablesSet(result.envVariables);
                            instanceContext.mergeFeaterVariablesSet(result.featerVariables);
                            await updateInstanceFromInstanceContext();
                        },
                    ),
                )
            ),
        );
    }

    protected addRemoveSources(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                instanceContext.sources.map(
                    source => new ContextAwareCommand(
                        taskId,
                        instanceContext.id,
                        `Remove source \`${source.id}\``,
                        () => new RemoveSourceCommand(
                            source.id,
                            source.paths.absolute.guest,
                        ),
                    ),
                )
            ),
        );
    }

    protected addRunDockerCompose(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                taskId,
                instanceContext.id,
                `Run docker-compose`,
                () => {
                    const composeFile = instanceContext.composeFiles[0];
                    const source = instanceContext.findSource(composeFile.sourceId);

                    return new RunDockerComposeCommand(
                        source.volume.name,
                        composeFile.envDirRelativePath,
                        composeFile.composeFileRelativePaths,
                        instanceContext.envVariables,
                        instanceContext.paths.dir.absolute.guest,
                    );
                },
            ),
        );
    }

    /**
     * When docker-compose setup is run it's possible to inspect containers and retrieve their ids
     * which will be needed to provide proxy domain for specified ports.
     */
    protected addGetContainerIds(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                taskId,
                instanceContext.id,
                `Get container ids`,
                () => new GetContainerIdsCommand(
                    instanceContext.composeProjectName,
                    instanceContext.services.map(
                        service => ({
                            serviceId: service.id,
                            containerNamePrefix: service.containerNamePrefix,
                        }),
                    ),
                ),
                async (result: GetContainerIdsCommandResultInterface): Promise<void> => {
                    for (const {serviceId, containerId} of result.serviceContainerIds) {
                        const service = instanceContext.findService(serviceId);
                        service.containerId = containerId;
                    }
                    instanceContext.mergeEnvVariablesSet(result.envVariables);
                    instanceContext.mergeFeaterVariablesSet(result.featerVariables);
                    await updateInstanceFromInstanceContext();
                },
            ),
        );
    }

    /**
     * All containers which have some ports exposed are connected to a separate network together with
     * Nginx container that will handle configurations for their proxy domains.
     */
    protected addConnectContainersToNetwork(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                instanceContext.proxiedPorts.map(
                    proxiedPort => new ContextAwareCommand(
                        taskId,
                        instanceContext.id,
                        `Connect service \`${proxiedPort.serviceId}\` to proxy network`,
                        () => {
                            const service = instanceContext.findService(proxiedPort.serviceId);

                            return new ConnectToNetworkCommand(
                                service.id,
                                service.containerId,
                            );
                        },
                        async (result: ConnectToNetworkCommandResultInterface): Promise<void> => {
                            const service = instanceContext.findService(proxiedPort.serviceId);
                            service.ipAddress = result.ipAddress;
                        },
                    ),
                ),
                true,
            ),
        );
    }

    protected addConfigureProxyDomains(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                instanceContext.proxiedPorts.map(
                    proxiedPort => new ContextAwareCommand(
                        taskId,
                        instanceContext.id,
                        `Prepare configuration for proxied port \`${proxiedPort.id}\``,
                        () => {
                            const service = instanceContext.findService(proxiedPort.serviceId);

                            return new ConfigureProxyDomainCommand(
                                proxiedPort.serviceId,
                                service.ipAddress,
                                proxiedPort.port,
                                proxiedPort.domain,
                            );
                        },
                        async (result: ConfigureProxyDomainCommandResultInterface): Promise<void> => {
                            proxiedPort.nginxConfig = result.nginxConfig;
                        },
                    ),
                ),
                true,
            ),
        );
    }

    protected addAfterBuildTasks(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        const commandMapItems: CommandsMapItem[] = instanceContext.afterBuildTasks.map(
            (afterBuildTask): CommandsMapItem => {
                const command = this.createAfterBuildTaskCommand(
                    afterBuildTask,
                    taskId,
                    instanceContext,
                    updateInstanceFromInstanceContext,
                );

                return new CommandsMapItem(
                    command,
                    afterBuildTask.id,
                    afterBuildTask.dependsOn || [],
                );
            },
        );

        createInstanceCommand.addCommand(
            new CommandsMap(commandMapItems),
        );
    }

    protected addEnableProxyDomains(
        createInstanceCommand: CommandsList,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new ContextAwareCommand(
                taskId,
                instanceContext.id,
                `Enable configuration for proxied ports`,
                () => new EnableProxyDomainsCommand(
                    instanceContext.hash,
                    instanceContext.proxiedPorts.map(
                        proxiedPort => proxiedPort.nginxConfig,
                    ),
                ),
            ),
        );
    }

    protected createBeforeBuildTaskCommand(
        beforeBuildTask: InstanceContextBeforeBuildTaskInterface,
        source: InstanceContextSourceInterface,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): CommandType {
        for (const factory of this.beforeBuildTaskCommandFactoryComponents) {
            if (factory.supportsType(beforeBuildTask.type)) {
                return factory.createCommand(
                    beforeBuildTask.type,
                    beforeBuildTask,
                    source,
                    taskId,
                    instanceContext,
                    updateInstanceFromInstanceContext,
                );
            }
        }

        throw new Error(`Unknown type of before build task ${beforeBuildTask.type} for source ${source.id}.`);
    }

    protected createAfterBuildTaskCommand(
        afterBuildTask: InstanceContextAfterBuildTaskInterface,
        taskId: string,
        instanceContext: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): CommandType {
        for (const factory of this.afterBuildTaskCommandFactoryComponents) {
            if (factory.supportsType(afterBuildTask.type)) {
                return factory.createCommand(
                    afterBuildTask.type,
                    afterBuildTask,
                    taskId,
                    instanceContext,
                    updateInstanceFromInstanceContext,
                );
            }
        }

        throw new Error(`Unknown type of after build task ${afterBuildTask.type}.`);
    }

}
