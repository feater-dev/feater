import * as GraphQLJSON from 'graphql-type-json';
import {Inject, Injectable} from '@nestjs/common';
import {GraphQLSchema} from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {InstanceTypeInterface} from '../type/instance-type.interface';
import {ProjectsResolverFactory} from '../resolver/projects-resolver-factory.component';
import {DefinitionResolverFactory} from '../resolver/definition-resolver-factory.component';
import {InstanceResolverFactory} from '../resolver/instance-resolver-factory.component';
import {BeforeBuildTaskTypeInterface} from '../type/nested/definition-config/before-build-task-type.interface';
import {DateResolverFactory} from '../resolver/date-resolver-factory.component';
import {DockerDaemonResolverFactory} from '../resolver/docker-daemon-resolver-factory.component';
import {AfterBuildTaskTypeInterface} from '../type/nested/definition-config/after-build-task-type.interface';
import {AssetResolverFactory} from '../resolver/asset-resolver-factory.component';
import {AssetTypeInterface} from '../type/asset-type.interface';
import {DeployKeyResolverFactory} from '../resolver/deploy-key-resolver-factory.component';
import {DeployKeyTypeInterface} from '../type/deploy-key-type.interface';
import {CommandLogInterface} from '../../persistence/interface/command-log.interface';
import {CommandLogsResolverFactory} from '../resolver/command-logs-resolver-factory.component';
import {CommandLogTypeInterface} from '../type/command-log-type.interface';
import {CommandLogEntriesResolverFactory} from '../resolver/command-log-entries-resolver-factory.component';
import {LogInterface} from '../../persistence/interface/log.interface';

@Injectable()
export class GraphqlSchemaFactory {
    constructor(
        @Inject('TypeDefsProvider') private readonly typeDefsProvider,
        private readonly projectsResolverFactory: ProjectsResolverFactory,
        private readonly definitionResolverFactory: DefinitionResolverFactory,
        private readonly instanceResolverFactory: InstanceResolverFactory,
        private readonly assetResolverFactory: AssetResolverFactory,
        private readonly deployKeyResolverFactory: DeployKeyResolverFactory,
        private readonly commandLogsResolverFactory: CommandLogsResolverFactory,
        private readonly commandLogEntriesResolverFactory: CommandLogEntriesResolverFactory,
        private readonly dateResolverFactory: DateResolverFactory,
        private readonly dockerDaemonResolverFactory: DockerDaemonResolverFactory,
    ) { }

    public createSchema(): GraphQLSchema {
        return makeExecutableSchema({
            typeDefs: this.typeDefsProvider,
            resolvers: this.createResolvers(),
        });
    }

    protected createResolvers(): any {
        return {
            JSON: GraphQLJSON,

            Query: {
                projects: this.projectsResolverFactory.getListResolver(),
                project: this.projectsResolverFactory.getItemResolver(
                    (obj: any, args: any): string => args.id,
                ),
                definitions: this.definitionResolverFactory.getListResolver(),
                definition: this.definitionResolverFactory.getItemResolver(
                    (obj: any, args: any): string => args.id,
                ),
                instances: this.instanceResolverFactory.getListResolver(),
                instance: this.instanceResolverFactory.getItemResolver(
                    (obj: any, args: any): string => args.id,
                ),
                assets: this.assetResolverFactory.getListResolver(),
                asset: this.assetResolverFactory.getItemResolver(
                    (obj: any, args: any): string => args.id,
                ),
                deployKeys: this.deployKeyResolverFactory.getListResolver(),
                deployKey: this.deployKeyResolverFactory.getItemResolver(
                    (obj: any, args: any): string => args.id,
                ),
            },

            Mutation: {
                createProject: this.projectsResolverFactory.getCreateItemResolver(),
                createDefinition: this.definitionResolverFactory.getCreateItemResolver(),
                createInstance: this.instanceResolverFactory.getCreateItemResolver(),
                removeInstance: this.instanceResolverFactory.getRemoveItemResolver(),
                stopService: this.instanceResolverFactory.getStopItemServiceResolver(),
                pauseService: this.instanceResolverFactory.getPauseItemServiceResolver(),
                startService: this.instanceResolverFactory.getStartItemServiceResolver(),
                unpauseService: this.instanceResolverFactory.getUnpauseItemServiceResolver(),
                createAsset: this.assetResolverFactory.getCreateItemResolver(),
                regenerateDeployKey: this.deployKeyResolverFactory.getRegenerateItemResolver(),
                generateMissingDeployKeys: this.deployKeyResolverFactory.getGenerateMissingItemsResolver(),
                removeUnusedDeployKeys: this.deployKeyResolverFactory.getRemoveUnusedItemsResolver(),
                removeDeployKey: this.deployKeyResolverFactory.getRemoveItemResolver(),
            },

            Project: {
                definitions: this.definitionResolverFactory.getListResolver(
                    (project: ProjectTypeInterface) => ({projectId: project.id.toString()}),
                ),
                assets: this.assetResolverFactory.getListResolver(
                    (project: ProjectTypeInterface) => ({
                        projectId: project.id,
                        uploaded: true,
                    }),
                ),
                createdAt: this.dateResolverFactory.getDateResolver(
                    (project: ProjectTypeInterface) => project.createdAt,
                ),
                updatedAt: this.dateResolverFactory.getDateResolver(
                    (project: ProjectTypeInterface) => project.updatedAt,
                ),
            },

            Definition: {
                project: this.projectsResolverFactory.getItemResolver(
                    (definition: DefinitionTypeInterface) => definition.projectId,
                ),
                instances: this.instanceResolverFactory.getListResolver(
                    (definition: DefinitionTypeInterface) => ({definitionId: definition.id.toString()}),
                ),
                configAsYaml: this.definitionResolverFactory.getConfigAsYamlResolver(),
                deployKeys: this.definitionResolverFactory.getDeployKeysResolver(),
                predictedEnvVariables: this.definitionResolverFactory.getPredictedEnvVariablesResolver(),
                predictedFeaterVariables: this.definitionResolverFactory.getPredictedFeaterVariablesResolver(),
                createdAt: this.dateResolverFactory.getDateResolver(
                    (instance: DefinitionTypeInterface) => instance.createdAt,
                ),
                updatedAt: this.dateResolverFactory.getDateResolver(
                    (instance: DefinitionTypeInterface) => instance.updatedAt,
                ),
            },

            Instance: {
                definition: this.definitionResolverFactory.getItemResolver(
                    (instance: InstanceTypeInterface) => instance.definitionId,
                ),
                createdAt: this.dateResolverFactory.getDateResolver(
                    (instance: InstanceTypeInterface) => instance.createdAt,
                ),
                updatedAt: this.dateResolverFactory.getDateResolver(
                    (instance: InstanceTypeInterface) => instance.updatedAt,
                ),
                completedAt: this.dateResolverFactory.getDateResolver(
                    (instance: InstanceTypeInterface) => instance.completedAt,
                ),
                failedAt: this.dateResolverFactory.getDateResolver(
                    (instance: InstanceTypeInterface) => instance.failedAt,
                ),
                commandLogs: this.commandLogsResolverFactory.getListResolver(
                    (instance: InstanceTypeInterface) => ({instanceId: instance.id.toString()}),
                ),
            },

            InstanceService: {
                containerState: this.dockerDaemonResolverFactory.getContainerStateResolver(
                    (instanceService: any) => instanceService.containerNamePrefix,
                ),
            },

            InstanceCommandLog: {
                createdAt: this.dateResolverFactory.getDateResolver(
                    (commandLog: CommandLogInterface) => commandLog.createdAt,
                ),
                completedAt: this.dateResolverFactory.getDateResolver(
                    (commandLog: CommandLogInterface) => commandLog.completedAt,
                ),
                failedAt: this.dateResolverFactory.getDateResolver(
                    (commandLog: CommandLogInterface) => commandLog.failedAt,
                ),
                entries: this.commandLogEntriesResolverFactory.getListResolver(
                    (commandLog: CommandLogTypeInterface) => ({'meta.commandLogId': commandLog.id}),
                ),
            },

            InstanceCommandLogEntry: {
                timestamp: this.dateResolverFactory.getDateResolver(
                    (commandLogEntry: LogInterface) => commandLogEntry.timestamp,
                ),
            },

            BeforeBuildTask: {
                __resolveType: (beforeBuildTask: BeforeBuildTaskTypeInterface): string => {
                    if ('copy' === beforeBuildTask.type) {
                        return 'CopyBeforeBuildTask';
                    }
                    if ('interpolate' === beforeBuildTask.type) {
                        return 'InterpolateBeforeBuildTask';
                    }
                    throw new Error();
                },
            },

            AfterBuildTask: {
                __resolveType: (afterBuildTask: AfterBuildTaskTypeInterface): string => {
                    switch (afterBuildTask.type) {
                        case 'executeHostCommand':
                            return 'ExecuteHostCommandAfterBuildTask';

                        case 'executeServiceCommand':
                            return 'ExecuteServiceCommandAfterBuildTask';

                        case 'copyAssetIntoContainer':
                            return 'CopyAssetIntoContainerAfterBuildTask';
                    }

                    throw new Error();
                },
            },

            Asset: {
                project: this.projectsResolverFactory.getItemResolver(
                    (asset: AssetTypeInterface) => asset.projectId,
                ),
                createdAt: this.dateResolverFactory.getDateResolver(
                    (asset: AssetTypeInterface) => asset.createdAt,
                ),
                updatedAt: this.dateResolverFactory.getDateResolver(
                    (asset: AssetTypeInterface) => asset.updatedAt,
                ),
            },

            DeployKey: {
                fingerprint: this.deployKeyResolverFactory.getItemFingerprintResolver(),
                createdAt: this.dateResolverFactory.getDateResolver(
                    (deployKey: DeployKeyTypeInterface) => deployKey.createdAt,
                ),
                updatedAt: this.dateResolverFactory.getDateResolver(
                    (deployKey: DeployKeyTypeInterface) => deployKey.updatedAt,
                ),
            },
        };
    }
}
