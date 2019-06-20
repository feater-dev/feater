import {Injectable} from '@nestjs/common';
import {ConfigTypeInterface} from '../api/type/nested/definition-config/config-type.interface';
import {SourceTypeInterface} from '../api/type/nested/definition-config/source-type.interface';
import {SourceReferenceTypeInterface} from '../api/type/nested/definition-config/source-reference-type.interface';
import {ProxiedPortTypeInterface} from '../api/type/nested/definition-config/proxied-port-type.interface';
import {SummaryItemTypeInterface} from '../api/type/nested/definition-config/summary-item-type.interface';
import {ComposeFileTypeInterface} from '../api/type/nested/definition-config/compose-file-type.interface';
import {EnvVariableTypeInterface} from '../api/type/nested/definition-config/env-variable-type.interface';
import {
    BeforeBuildTaskTypeInterface,
    CopyBeforeBuildTaskTypeInterface,
    InterpolateBeforeBuildTaskTypeInterface,
} from '../api/type/nested/definition-config/before-build-task-type.interface';
import {
    AfterBuildTaskTypeInterface,
    CopyAssetIntoContainerAfterBuildTaskTypeInterface,
    ExecuteServiceCommandAfterBuildTaskTypeInterface,
} from '../api/type/nested/definition-config/after-build-task-type.interface';
import {AssetVolumeTypeInterface} from '../api/type/nested/definition-config/asset-volume-type.interface';
import {SourceVolumeTypeInterface} from '../api/type/nested/definition-config/source-volume-type.interface';
import * as jsYaml from 'js-yaml';
import * as camelCaseKeys from 'camelcase-keys';

@Injectable()
export class DefinitionConfigMapper {

    protected readonly supportedSchemaVersions = [
        '0.1.0',
    ];

    map(configAsYaml: string): ConfigTypeInterface {
        const configAsJson: any = camelCaseKeys(jsYaml.safeLoad(configAsYaml), {deep: true});
        if (-1 === this.supportedSchemaVersions.indexOf(configAsJson.schemaVersion)) {
            throw new Error(`Unsupported schema version ${configAsJson.schemaVersion}.`);
        }

        // TODO Some interface can be used once schema version is determined.

        const mappedSources: SourceTypeInterface[] = [];
        for (const source of configAsJson.sources) {
            mappedSources.push(this.mapSource(source));
        }

        const mappedAssetVolumes: AssetVolumeTypeInterface[] = [];
        for (const assetVolume of configAsJson.assetVolumes) {
            mappedAssetVolumes.push(this.mapAssetVolume(assetVolume));
        }

        const mappedSourceVolumes: AssetVolumeTypeInterface[] = [];
        for (const sourceVolume of configAsJson.sourceVolumes) {
            mappedSourceVolumes.push(this.mapSourceVolume(sourceVolume));
        }

        const mappedEnvVariables: EnvVariableTypeInterface[] = [];
        if (configAsJson.envVariables) {
            for (const envVariable of configAsJson.envVariables) {
                mappedEnvVariables.push(
                    this.mapEnvVariable(envVariable),
                );
            }
        }

        const mappedComposeFiles: ComposeFileTypeInterface[] = [];
        if (configAsJson.composeFiles) {
            for (const composeFile of configAsJson.composeFiles) {
                mappedComposeFiles.push(this.mapComposeFile(composeFile));
            }
        }

        const mappedProxiedPorts: ProxiedPortTypeInterface[] = [];
        for (const proxiedPort of configAsJson.proxiedPorts) {
            mappedProxiedPorts.push(
                this.mapProxiedPort(proxiedPort),
            );
        }

        const mappedAfterBuildTasks: AfterBuildTaskTypeInterface[] = [];
        for (const afterBuildTask of configAsJson.afterBuildTasks) {
            mappedAfterBuildTasks.push(this.mapAfterBuildTask(afterBuildTask));
        }

        const mappedSummaryItems: SummaryItemTypeInterface[] = [];
        for (const summaryItem of configAsJson.summaryItems) {
            mappedSummaryItems.push(this.mapSummaryItem(summaryItem));
        }

        return {
            sources: mappedSources,
            sourceVolumes: mappedSourceVolumes,
            assetVolumes: mappedAssetVolumes,
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
            cloneUrl: source.cloneUrl,
            useDeployKey: source.useDeployKey,
            reference: this.mapSourceReference(source.reference),
            beforeBuildTasks: mappedBeforeBuildTasks,
        } as SourceTypeInterface;
    }

    protected mapAssetVolume(assetVolume: any): AssetVolumeTypeInterface {
        const mappedAssetVolume: AssetVolumeTypeInterface = {
            id: assetVolume.id,
        };

        if (assetVolume.assetId) {
            mappedAssetVolume.assetId = assetVolume.assetId;
        }

        return mappedAssetVolume;
    }

    protected mapSourceVolume(sourceVolume: any): SourceVolumeTypeInterface {
        const mappedSourceVolume: SourceVolumeTypeInterface = {
            id: sourceVolume.id,
            sourceId: sourceVolume.sourceId,
        };

        if (sourceVolume.relativePath) {
            mappedSourceVolume.relativePath = sourceVolume.relativePath;
        }

        return mappedSourceVolume;
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
                throw new Error('Unknown before build task type.');
        }
    }

    protected mapAfterBuildTask(afterBuildTask: any): AfterBuildTaskTypeInterface {
        let mapped: AfterBuildTaskTypeInterface;

        const commonMapped: AfterBuildTaskTypeInterface = {
            type: afterBuildTask.type,
        };
        if (afterBuildTask.id) {
            commonMapped.id = afterBuildTask.id;
        }
        if (afterBuildTask.dependsOn) {
            commonMapped.dependsOn = afterBuildTask.dependsOn;
        }

        switch (afterBuildTask.type) {
            case 'executeServiceCommand':
                mapped = {
                    ...commonMapped,
                    serviceId: afterBuildTask.serviceId,
                    customEnvVariables: afterBuildTask.customEnvVariables,
                    inheritedEnvVariables: afterBuildTask.inheritedEnvVariables,
                    command: afterBuildTask.command,
                } as ExecuteServiceCommandAfterBuildTaskTypeInterface;

                break;

            case 'copyAssetIntoContainer':
                mapped = {
                    ...commonMapped,
                    serviceId: afterBuildTask.serviceId,
                    assetId: afterBuildTask.assetId,
                    destinationPath: afterBuildTask.destinationPath,
                } as CopyAssetIntoContainerAfterBuildTaskTypeInterface;

                break;

            default:
                throw new Error('Unknown after build task type.');
        }

        return mapped;
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
            value: summaryItem.value,
        } as SummaryItemTypeInterface;
    }

    protected mapEnvVariable(envVariable: any): EnvVariableTypeInterface {
        return envVariable as EnvVariableTypeInterface;
    }

    protected mapComposeFile(composeFile: any): ComposeFileTypeInterface {
        return composeFile as ComposeFileTypeInterface;
    }
}
