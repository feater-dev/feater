import * as path from 'path';
import {Injectable} from '@nestjs/common';
import {BaseLogger} from '../logger/base-logger';
import {FeaterVariablesSet} from './sets/feater-variables-set';
import {ComplexCommand} from './executor/complex-command.interface';
import {ContextAwareCommand} from './executor/context-aware-command.interface';
import {CreateDirectoryCommand} from './command/create-directory/command';
import {CreateVolumeFromAssetCommand} from './command/create-volume-from-asset/command';
import {CreateVolumeFromAssetCommandResultInterface} from './command/create-volume-from-asset/command-result.interface';
import {EnvVariablesSet} from './sets/env-variables-set';
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
import {PrepareSourceEnvVarsCommand} from './command/prepare-source-env-vars/command';
import {PrepareSourceEnvVarsCommandResultInterface} from './command/prepare-source-env-vars/command-result.interface';
import {PrepareSummaryItemsCommand} from './command/prepare-summary-items/command';
import {CommandInterface} from './executor/command.interface';
import {CopyFileCommandFactoryComponent} from './command/before-build/copy-file/command-factory.component';
import {InterpolateFileCommandFactoryComponent} from './command/before-build/interpolate-file/command-factory.component';
import {BeforeBuildTaskCommandFactoryInterface} from './command/before-build/command-factory.interface';
import {CopyAssetIntoContainerCommandFactoryComponent} from './command/after-build/copy-asset-into-container/command-factory.component';
import {ExecuteHostCmdCommandFactoryComponent} from './command/after-build/execute-host-cmd/command-factory.component';
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
import {SummaryItemsSet} from './sets/summary-items-set';
import {InstanceRepository} from '../persistence/repository/instance.repository';

@Injectable()
export class InstanceCreatorComponent {

    protected readonly beforeBuildTaskCommandFactoryComponents: BeforeBuildTaskCommandFactoryInterface[];
    protected readonly afterBuildTaskCommandFactoryComponents: AfterBuildTaskCommandFactoryInterface[];

    constructor(
        protected readonly instanceRepository: InstanceRepository,
        protected readonly instanceContextFactory: InstanceContextFactory,
        protected readonly logger: BaseLogger,
        protected readonly commandExecutorComponent: CommandExecutorComponent,
        copyFileCommandFactoryComponent: CopyFileCommandFactoryComponent,
        interpolateFileCommandFactoryComponent: InterpolateFileCommandFactoryComponent,
        copyAssetIntoContainerCommandFactoryComponent: CopyAssetIntoContainerCommandFactoryComponent,
        executeHostCmdCommandFactoryComponent: ExecuteHostCmdCommandFactoryComponent,
        executeServiceCmdCommandFactoryComponent: ExecuteServiceCmdCommandFactoryComponent,
    ) {
        this.beforeBuildTaskCommandFactoryComponents = [
            copyFileCommandFactoryComponent,
            interpolateFileCommandFactoryComponent,
        ];

        this.afterBuildTaskCommandFactoryComponents = [
            copyAssetIntoContainerCommandFactoryComponent,
            executeHostCmdCommandFactoryComponent,
            executeServiceCmdCommandFactoryComponent,
        ];
    }

    async runInstance(id: string, hash: string, definition: any): Promise<any> {
        const {config: definitionConfig} = definition.toObject();
        const instanceContext = this.instanceContextFactory.create(id, hash, definitionConfig);

        const createInstanceCommand = new ComplexCommand([], false);

        this.addCreateDirectory(createInstanceCommand, instanceContext);
        this.addCloneSources(createInstanceCommand, instanceContext);
        this.addCreateVolumeFromAssets(createInstanceCommand, instanceContext);
        this.addParseDockerCompose(createInstanceCommand, instanceContext);
        this.addPrepareProxyDomains(createInstanceCommand, instanceContext);
        this.addPrepareEnvVarsForSources(createInstanceCommand, instanceContext);
        this.addPrepareSummaryItems(createInstanceCommand, instanceContext);
        this.addBeforeBuildTasks(createInstanceCommand, instanceContext);
        this.addRunDockerCompose(createInstanceCommand, instanceContext);
        this.addGetContainerIds(createInstanceCommand, instanceContext);
        this.addConnectContainersToNetwork(createInstanceCommand, instanceContext);
        this.addConfigureProxyDomains(createInstanceCommand, instanceContext);
        this.addAfterBuildTasks(createInstanceCommand, instanceContext);
        this.addEnableProxyDomains(createInstanceCommand, instanceContext);

        return this.commandExecutorComponent
            .execute(createInstanceCommand, instanceContext)
            .then(
                async (): Promise<InstanceContext> => {
                    this.logger.info('Build instantiated and started.');
                    const persistentInstance = await this.instanceRepository.findById(instanceContext.id);
                    await this.instanceRepository.updateFromInstanceContext(persistentInstance, instanceContext);

                    return instanceContext;
                },
                error => {
                    this.logger.error('Failed to instantiate and start build.');

                    throw error;
                },
            );
    }

    protected addCreateDirectory(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(new ContextAwareCommand(
            `Create instance build directory`,
            (instanceContext: InstanceContext) => new CreateDirectoryCommand(
                instanceContext.paths.dir.absolute.guest,
            ),
        ));
    }

    protected addCreateVolumeFromAssets(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ComplexCommand(
                instanceContext.volumes.map(
                    volume => new ContextAwareCommand(
                        `Create asset volume \`${volume.id}\``,
                        (instanceContext: InstanceContext) => {
                            return new CreateVolumeFromAssetCommand(
                                volume.id,
                                volume.assetId,
                                instanceContext.composeProjectName,
                                instanceContext.paths.dir.absolute.guest,
                                volume.paths.extractDir.absolute.guest,
                                volume.paths.extractDir.absolute.host,
                            );
                        },
                        (
                            result: CreateVolumeFromAssetCommandResultInterface,
                            instanceContext: InstanceContext,
                        ) => {
                            instanceContext.mergeEnvVariablesSet(result.envVariables);
                            instanceContext.mergeFeaterVariablesSet(result.featerVariables);
                        },
                    ),
                ),
                true,
            ),
        );
    }

    protected addCloneSources(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ComplexCommand(
                instanceContext.sources.map(
                    source => new ContextAwareCommand(
                        `Clone repository for source \`${source.id}\``,
                        (instanceContext: InstanceContext) => new CloneSourceCommand(
                            source.cloneUrl,
                            source.reference.type,
                            source.reference.name,
                            source.paths.dir.absolute.guest,
                        ),
                    ),
                ),
                true,
            ),
        );
    }

    /**
     * This stage will detect what services are available and will detect container prefix
     * names they should be assigned.
     */
    protected addParseDockerCompose(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ContextAwareCommand(
                `Parse docker-compose configuration`,
                (instanceContext: InstanceContext) => {
                    const source = instanceContext.findSource(instanceContext.composeFiles[0].sourceId);

                    return new ParseDockerComposeCommand(
                        instanceContext.composeFiles[0].composeFileRelativePaths.map(
                            composeFileRelativePath => path.join(
                                source.paths.dir.absolute.guest,
                                composeFileRelativePath,
                            ),
                        ),
                        instanceContext.composeProjectName,
                    );
                },
                (
                    result: ParseDockerComposeCommandResultInterface,
                    instanceContext: InstanceContext,
                ) => {
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
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ComplexCommand(
                instanceContext.proxiedPorts.map(
                    proxiedPort => new ContextAwareCommand(
                        `Prepare domain for proxied port \`${proxiedPort.id}\``,
                        (instanceContext: InstanceContext) => new PrepareProxyDomainCommand(
                            instanceContext.hash,
                            proxiedPort.id,
                        ),
                        (
                            result: PrepareProxyDomainCommandResultInterface,
                            instanceContext: InstanceContext,
                        ) => {
                            proxiedPort.domain = result.proxyDomain;
                            instanceContext.mergeEnvVariablesSet(result.envVariables);
                            instanceContext.mergeFeaterVariablesSet(result.featerVariables);
                        },
                    ),
                ),
                true,
            ),
        );
    }

    /**
     * Paths to source for guest and host are made available as env variables.
     */
    protected addPrepareEnvVarsForSources(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ComplexCommand(
                instanceContext.sources.map(
                    source => new ContextAwareCommand(
                        `Prepare environment variables for source \`${source.id}\``,
                        (instanceContext: InstanceContext) => new PrepareSourceEnvVarsCommand(
                            source.id,
                            source.paths.dir.absolute.guest,
                            source.paths.dir.absolute.host,
                        ),
                        (
                            result: PrepareSourceEnvVarsCommandResultInterface,
                            instanceContext: InstanceContext,
                        ) => {
                            instanceContext.mergeEnvVariablesSet(result.envVariables);
                            instanceContext.mergeFeaterVariablesSet(result.featerVariables);
                        },
                    ),
                ),
                true,
            ),
        );
    }

    protected addPrepareSummaryItems(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ContextAwareCommand(
                `Prepare summary items`,
                (instanceContext: InstanceContext) => new PrepareSummaryItemsCommand(
                    FeaterVariablesSet.fromList(instanceContext.featerVariables),
                    SummaryItemsSet.fromList(instanceContext.summaryItems),
                ),
                (
                    result: PrepareSummaryItemsCommandResultInterface,
                    instanceContext: InstanceContext,
                ) => {
                    instanceContext.summaryItems = result.summaryItems.toList();
                },
            ),
        );
    }

    protected addBeforeBuildTasks(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ComplexCommand(
                instanceContext.sources.map(
                    source => new ComplexCommand(
                        source.beforeBuildTasks.map(
                            beforeBuildTask => this.createBeforeBuildTaskCommand(
                                beforeBuildTask,
                                source,
                                instanceContext,
                            ),
                        ),
                        false,
                    ),
                ),
                true,
            ),
        );
    }

    protected addRunDockerCompose(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ContextAwareCommand(
                `Run docker-compose`,
                (instanceContext: InstanceContext) => {
                    const composeFile = instanceContext.composeFiles[0]; // TODO Handle multiple compose files.
                    const source = instanceContext.findSource(composeFile.sourceId);

                    return new RunDockerComposeCommand(
                        path.join(source.paths.dir.absolute.guest, composeFile.envDirRelativePath),
                        composeFile.composeFileRelativePaths.map(
                            composeFileRelativePath => path.join(
                                source.paths.dir.absolute.guest,
                                composeFileRelativePath,
                            ),
                        ),
                        instanceContext.composeProjectName,
                        EnvVariablesSet.fromList(instanceContext.envVariables),
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
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ContextAwareCommand(
                `Get container ids`,
                (instanceContext: InstanceContext) => new GetContainerIdsCommand(
                    instanceContext.composeProjectName,
                    instanceContext.services.map(
                        service => ({
                            serviceId: service.id,
                            containerNamePrefix: service.containerNamePrefix,
                        }),
                    ),
                ),
                (
                    result: GetContainerIdsCommandResultInterface,
                    instanceContext: InstanceContext,
                ) => {
                    for (const {serviceId, containerId} of result.serviceContainerIds) {
                        const service = instanceContext.findService(serviceId);
                        service.containerId = containerId;
                    }
                    instanceContext.mergeEnvVariablesSet(result.envVariables);
                    instanceContext.mergeFeaterVariablesSet(result.featerVariables);
                },
            ),
        );
    }

    /**
     * All containers which have some ports exposed are connected to a separate network together with
     * Nginx container that will handle configurations for their proxy domains.
     */
    protected addConnectContainersToNetwork(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ComplexCommand(
                instanceContext.proxiedPorts.map(
                    proxiedPort => new ContextAwareCommand(
                        `Connect service \`${proxiedPort.serviceId}\` to proxy network`,
                        (instanceContext: InstanceContext) => {
                            const service = instanceContext.findService(proxiedPort.serviceId);

                            return new ConnectToNetworkCommand(
                                service.id,
                                service.containerId,
                            );
                        },
                        (
                            result: ConnectToNetworkCommandResultInterface,
                            instanceContext: InstanceContext,
                        ) => {
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
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ComplexCommand(
                instanceContext.proxiedPorts.map(
                    proxiedPort => new ContextAwareCommand(
                        `Prepare configuration for proxied port \`${proxiedPort.id}\``,
                        (instanceContext: InstanceContext) => {
                            const service = instanceContext.findService(proxiedPort.serviceId);

                            return new ConfigureProxyDomainCommand(
                                proxiedPort.serviceId,
                                service.ipAddress,
                                proxiedPort.port,
                                proxiedPort.domain,
                            );
                        },
                        (
                            result: ConfigureProxyDomainCommandResultInterface,
                            instanceContext: InstanceContext,
                        ) => {
                            proxiedPort.nginxConfig = result.nginxConfig;
                        },
                    ),
                ),
                true,
            ),
        );
    }

    protected addAfterBuildTasks(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ComplexCommand(
                instanceContext.afterBuildTasks.map(
                    afterBuildTask => this.createAfterBuildTaskCommand(
                        afterBuildTask,
                        instanceContext,
                    ),
                ),
                false,
            ),
        );
    }

    protected addEnableProxyDomains(
        createInstanceCommand: ComplexCommand,
        instanceContext: InstanceContext,
    ) {
        createInstanceCommand.addChild(
            new ContextAwareCommand(
                `Enable configuration for proxied ports`,
                (instanceContext: InstanceContext) => new EnableProxyDomainsCommand(
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
        instanceContext: InstanceContext,
    ): CommandInterface {
        for (const factory of this.beforeBuildTaskCommandFactoryComponents) {
            if (factory.supportsType(beforeBuildTask.type)) {
                return factory.createCommand(
                    beforeBuildTask.type,
                    beforeBuildTask,
                    source,
                    instanceContext,
                );
            }
        }

        throw new Error(`Unknown type of before build task ${beforeBuildTask.type} for source ${source.id}.`);
    }

    protected createAfterBuildTaskCommand(
        afterBuildTask: InstanceContextAfterBuildTaskInterface,
        instanceContext: InstanceContext,
    ): CommandInterface {
        for (const factory of this.afterBuildTaskCommandFactoryComponents) {
            if (factory.supportsType(afterBuildTask.type)) {
                return factory.createCommand(
                    afterBuildTask.type,
                    afterBuildTask,
                    instanceContext,
                );
            }
        }

        throw new Error(`Unknown type of after build task ${afterBuildTask.type}.`);
    }

}
