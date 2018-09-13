import {Component} from '@nestjs/common';
import {ConfigTypeInterface} from '../type/nested/definition-config/config-type.interface';
import {SourceTypeInterface} from '../type/nested/definition-config/source-type.interface';
import {SourceReferenceTypeInterface} from '../type/nested/definition-config/source-reference-type.interface';
import {ProxiedPortTypeInterface} from '../type/nested/definition-config/proxied-port-type.interface';
import {SummaryItemTypeInterface} from '../type/nested/definition-config/summary-item-type.interface';
import {ComposeFileTypeInterface} from '../type/nested/definition-config/compose-file-type.interface';
import {EnvVariableTypeInterface} from '../type/nested/definition-config/env-variable-type.interface';
import {
    BeforeBuildTaskTypeInterface,
    CopyBeforeBuildTaskTypeInterface,
    InterpolateBeforeBuildTaskTypeInterface
} from '../type/nested/definition-config/before-build-task-type.interface';
import {
    AfterBuildTaskTypeInterface, CopyAssetIntoContainerAfterBuildTaskTypeInterface,
    ExecuteHostCommandAfterBuildTaskTypeInterface, ExecuteServiceCommandAfterBuildTaskTypeInterface,
} from '../type/nested/definition-config/after-build-task-type.interface';

@Component()
export class DefinitionConfigMapper {
    public map(config: any): ConfigTypeInterface {
        const mappedSources: SourceTypeInterface[] = [];
        for (const source of config.sources) {
            mappedSources.push(this.mapSource(source));
        }

        const mappedProxiedPorts: ProxiedPortTypeInterface[] = [];
        for (const proxiedPort of config.proxiedPorts) {
            mappedProxiedPorts.push(
                this.mapProxiedPort(proxiedPort),
            );
        }

        const mappedEnvVariables: EnvVariableTypeInterface[] = [];
        if (config.envVariables) {
            for (const envVariable of config.envVariables) {
                mappedEnvVariables.push(
                    this.mapEnvVariable(envVariable),
                );
            }
        }

        const mappedComposeFiles: ComposeFileTypeInterface[] = [];
        if (config.composeFiles) {
            for (const composeFile of config.composeFiles) {
                mappedComposeFiles.push(this.mapComposeFile(composeFile));
            }
        } else {
            mappedComposeFiles.push(this.mapComposeFile(config.composeFile));
        }

        const mappedAfterBuildTasks: AfterBuildTaskTypeInterface[] = [];
        for (const afterBuildTask of config.afterBuildTasks) {
            mappedAfterBuildTasks.push(this.mapAfterBuildTask(afterBuildTask));
        }

        const mappedSummaryItems: SummaryItemTypeInterface[] = [];
        for (const summaryItem of config.summaryItems) {
            mappedSummaryItems.push(this.mapSummaryItem(summaryItem));
        }

        return {
            sources: mappedSources,
            proxiedPorts: mappedProxiedPorts,
            envVariables: mappedEnvVariables,
            composeFiles: mappedComposeFiles,
            afterBuildTasks: mappedAfterBuildTasks,
            summaryItems: mappedSummaryItems,
        } as ConfigTypeInterface;
    }

    protected mapSource(source: any): SourceTypeInterface {
        const mappedBeforeBuildTasks: BeforeBuildTaskTypeInterface[] = [];

        if (source.beforeBuildTasks) {
            for (const beforeBuildTask of source.beforeBuildTasks) {
                mappedBeforeBuildTasks.push(this.mapBeforeBuildTask(beforeBuildTask));
            }
        }

        return {
            id: source.id,
            sshCloneUrl: source.sshCloneUrl,
            reference: this.mapSourceReference(source.reference),
            beforeBuildTasks: mappedBeforeBuildTasks,
        } as SourceTypeInterface;
    }

    protected mapBeforeBuildTask(beforeBuildTask: any): BeforeBuildTaskTypeInterface {
        switch (beforeBuildTask.type) {
            case 'copy':
                return {
                    type: beforeBuildTask.type,
                    sourceRelativePath: beforeBuildTask.sourceRelativePath,
                    destinationRelativePath: beforeBuildTask.destinationRelativePath,
                } as CopyBeforeBuildTaskTypeInterface;

            case 'interpolate':
                return {
                    type: beforeBuildTask.type,
                    relativePath: beforeBuildTask.relativePath,
                } as InterpolateBeforeBuildTaskTypeInterface;

            default:
                throw new Error();
        }
    }

    protected mapAfterBuildTask(afterBuildTask: any): AfterBuildTaskTypeInterface {
        switch (afterBuildTask.type) {
            case 'executeHostCommand':
                return {
                    type: afterBuildTask.type,
                    customEnvVariables: afterBuildTask.customEnvVariables,
                    inheritedEnvVariables: afterBuildTask.inheritedEnvVariables,
                    command: afterBuildTask.command,
                } as ExecuteHostCommandAfterBuildTaskTypeInterface;

            case 'executeServiceCommand':
                return {
                    type: afterBuildTask.type,
                    serviceId: afterBuildTask.serviceId,
                    customEnvVariables: afterBuildTask.customEnvVariables,
                    inheritedEnvVariables: afterBuildTask.inheritedEnvVariables,
                    command: afterBuildTask.command,
                } as ExecuteServiceCommandAfterBuildTaskTypeInterface;

            case 'copyAssetIntoContainer':
                return {
                    type: afterBuildTask.type,
                    serviceId: afterBuildTask.serviceId,
                    assetId: afterBuildTask.assetId,
                    destinationPath: afterBuildTask.destinationPath,
                } as CopyAssetIntoContainerAfterBuildTaskTypeInterface;

            default:
                throw new Error();
        }
    }

    protected mapSourceReference(reference: any): SourceReferenceTypeInterface {
        return {
            type: reference.type,
            name: reference.name,
        } as SourceReferenceTypeInterface;
    }

    protected mapProxiedPort(proxiedPort: any): ProxiedPortTypeInterface {
        return {
            id: proxiedPort.id,
            serviceId: proxiedPort.serviceId,
            port: proxiedPort.port,
            name: proxiedPort.name,
        } as ProxiedPortTypeInterface;
    }

    protected mapSummaryItem(summaryItem: any): SummaryItemTypeInterface {
        return {
            name: summaryItem.name,
            text: summaryItem.text,
        } as SummaryItemTypeInterface;
    }

    protected mapEnvVariable(envVariable: any): EnvVariableTypeInterface {
        return envVariable as EnvVariableTypeInterface;
    }

    protected mapComposeFile(composeFile: any): ComposeFileTypeInterface {
        return composeFile as ComposeFileTypeInterface;
    }
}
