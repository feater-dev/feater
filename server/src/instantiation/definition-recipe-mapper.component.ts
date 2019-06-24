import {Injectable} from '@nestjs/common';
import {RecipeTypeInterface} from '../api/type/nested/definition-recipe/recipe-type.interface';
import {SourceTypeInterface} from '../api/type/nested/definition-recipe/source-type.interface';
import {SourceReferenceTypeInterface} from '../api/type/nested/definition-recipe/source-reference-type.interface';
import {ProxiedPortTypeInterface} from '../api/type/nested/definition-recipe/proxied-port-type.interface';
import {SummaryItemTypeInterface} from '../api/type/nested/definition-recipe/summary-item-type.interface';
import {ComposeFileTypeInterface} from '../api/type/nested/definition-recipe/compose-file-type.interface';
import {EnvVariableTypeInterface} from '../api/type/nested/definition-recipe/env-variable-type.interface';
import {
    BeforeBuildTaskTypeInterface,
    CopyBeforeBuildTaskTypeInterface,
    InterpolateBeforeBuildTaskTypeInterface,
} from '../api/type/nested/definition-recipe/before-build-task-type.interface';
import {
    AfterBuildTaskTypeInterface,
    CopyAssetIntoContainerAfterBuildTaskTypeInterface,
    ExecuteServiceCommandAfterBuildTaskTypeInterface,
} from '../api/type/nested/definition-recipe/after-build-task-type.interface';
import {AssetVolumeTypeInterface} from '../api/type/nested/definition-recipe/asset-volume-type.interface';
import {SourceVolumeTypeInterface} from '../api/type/nested/definition-recipe/source-volume-type.interface';
import * as jsYaml from 'js-yaml';
import * as camelCaseKeys from 'camelcase-keys';

@Injectable()
export class DefinitionRecipeMapper {

    protected readonly supportedSchemaVersions = [
        '0.1.0',
    ];

    map(recipeAsYaml: string): RecipeTypeInterface {
        const recipeAsJson: any = camelCaseKeys(jsYaml.safeLoad(recipeAsYaml), {deep: true});
        if (-1 === this.supportedSchemaVersions.indexOf(recipeAsJson.schemaVersion)) {
            throw new Error(`Unsupported schema version ${recipeAsJson.schemaVersion}.`);
        }

        // TODO Some interface can be used once schema version is determined.

        const mappedSources: SourceTypeInterface[] = [];
        for (const source of recipeAsJson.sources) {
            mappedSources.push(this.mapSource(source));
        }

        const mappedAssetVolumes: AssetVolumeTypeInterface[] = [];
        for (const assetVolume of recipeAsJson.assetVolumes) {
            mappedAssetVolumes.push(this.mapAssetVolume(assetVolume));
        }

        const mappedSourceVolumes: AssetVolumeTypeInterface[] = [];
        for (const sourceVolume of recipeAsJson.sourceVolumes) {
            mappedSourceVolumes.push(this.mapSourceVolume(sourceVolume));
        }

        const mappedEnvVariables: EnvVariableTypeInterface[] = [];
        if (recipeAsJson.envVariables) {
            for (const envVariable of recipeAsJson.envVariables) {
                mappedEnvVariables.push(
                    this.mapEnvVariable(envVariable),
                );
            }
        }

        const mappedComposeFiles: ComposeFileTypeInterface[] = [];
        if (recipeAsJson.composeFiles) {
            for (const composeFile of recipeAsJson.composeFiles) {
                mappedComposeFiles.push(this.mapComposeFile(composeFile));
            }
        }

        const mappedProxiedPorts: ProxiedPortTypeInterface[] = [];
        for (const proxiedPort of recipeAsJson.proxiedPorts) {
            mappedProxiedPorts.push(
                this.mapProxiedPort(proxiedPort),
            );
        }

        const mappedAfterBuildTasks: AfterBuildTaskTypeInterface[] = [];
        for (const afterBuildTask of recipeAsJson.afterBuildTasks) {
            mappedAfterBuildTasks.push(this.mapAfterBuildTask(afterBuildTask));
        }

        const mappedSummaryItems: SummaryItemTypeInterface[] = [];
        for (const summaryItem of recipeAsJson.summaryItems) {
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
        } as RecipeTypeInterface;
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
            case 'execute_service_command':
                mapped = {
                    ...commonMapped,
                    serviceId: afterBuildTask.serviceId,
                    customEnvVariables: afterBuildTask.customEnvVariables,
                    inheritedEnvVariables: afterBuildTask.inheritedEnvVariables,
                    command: afterBuildTask.command,
                } as ExecuteServiceCommandAfterBuildTaskTypeInterface;

                break;

            case 'copy_asset_into_container':
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
            nginxConfigTemplate: proxiedPort.nginxConfigTemplate,
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
