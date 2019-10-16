import { Injectable } from '@nestjs/common';
import {
    ActionInterface,
    AfterBuildTask,
    AfterBuildTaskInterface,
    AssetVolumeInterface,
    BeforeBuildTask,
    ComposeFileInterface,
    DownloadableInterface,
    EnvVariableInterface,
    ProxiedPortInterface,
    SourceInterface,
    SourceReferenceInterface,
    SourceVolumeInterface,
    SummaryItemInterface,
} from '../../recipe.interface';

@Injectable()
export class RecipePartMapper {
    public mapSource(source: any): SourceInterface {
        const mappedBeforeBuildTasks: BeforeBuildTask[] = [];

        if (source.beforeBuildTasks) {
            for (const beforeBuildTask of source.beforeBuildTasks) {
                mappedBeforeBuildTasks.push(
                    this.mapBeforeBuildTask(beforeBuildTask),
                );
            }
        }

        return {
            id: source.id,
            cloneUrl: source.cloneUrl,
            useDeployKey: source.useDeployKey,
            reference: this.mapSourceReference(source.reference),
            beforeBuildTasks: mappedBeforeBuildTasks,
        };
    }

    public mapAssetVolume(assetVolume: any): AssetVolumeInterface {
        const mappedAssetVolume: AssetVolumeInterface = {
            id: assetVolume.id,
        };

        if (assetVolume.assetId) {
            mappedAssetVolume.assetId = assetVolume.assetId;
        }

        return mappedAssetVolume;
    }

    public mapSourceVolume(sourceVolume: any): SourceVolumeInterface {
        const mappedSourceVolume: SourceVolumeInterface = {
            id: sourceVolume.id,
            sourceId: sourceVolume.sourceId,
        };

        if (sourceVolume.relativePath) {
            mappedSourceVolume.relativePath = sourceVolume.relativePath;
        }

        return mappedSourceVolume;
    }

    public mapBeforeBuildTask(beforeBuildTask: any): BeforeBuildTask {
        switch (beforeBuildTask.type) {
            case 'copy':
                return {
                    type: beforeBuildTask.type,
                    sourceRelativePath: beforeBuildTask.sourceRelativePath,
                    destinationRelativePath:
                        beforeBuildTask.destinationRelativePath,
                };

            case 'interpolate':
                return {
                    type: beforeBuildTask.type,
                    relativePath: beforeBuildTask.relativePath,
                };
        }

        throw new Error('Unknown before build task type.');
    }

    public mapAfterBuildTask(afterBuildTask: any): AfterBuildTask {
        let mapped: AfterBuildTaskInterface;

        const commonMapped: AfterBuildTaskInterface = {
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
                return {
                    ...commonMapped,
                    serviceId: afterBuildTask.serviceId,
                    customEnvVariables: afterBuildTask.customEnvVariables,
                    inheritedEnvVariables: afterBuildTask.inheritedEnvVariables,
                    command: afterBuildTask.command,
                };

                break;

            case 'copy_asset_into_container':
                return {
                    ...commonMapped,
                    serviceId: afterBuildTask.serviceId,
                    assetId: afterBuildTask.assetId,
                    destinationPath: afterBuildTask.destinationPath,
                };
        }

        throw new Error('Unknown after build task type.');
    }

    public mapSourceReference(reference: any): SourceReferenceInterface {
        return {
            type: reference.type,
            name: reference.name,
        };
    }

    public mapProxiedPort(proxiedPort: any): ProxiedPortInterface {
        return {
            id: proxiedPort.id,
            serviceId: proxiedPort.serviceId,
            port: proxiedPort.port,
            name: proxiedPort.name,
            nginxConfigTemplate: proxiedPort.nginxConfigTemplate,
        };
    }

    public mapSummaryItem(summaryItem: any): SummaryItemInterface {
        return {
            name: summaryItem.name,
            value: summaryItem.value,
        };
    }

    public mapAction(action: any): ActionInterface {
        const mappedAfterBuildTasks: AfterBuildTask[] = [];
        for (const afterBuildTask of action.afterBuildTasks) {
            mappedAfterBuildTasks.push(this.mapAfterBuildTask(afterBuildTask));
        }

        return {
            type: action.type,
            id: action.id,
            name: action.name,
            afterBuildTasks: mappedAfterBuildTasks,
        };
    }

    public mapDownloadable(downloadable: any): DownloadableInterface {
        return {}; // TODO Forward port.
    }

    public mapEnvVariable(envVariable: any): EnvVariableInterface {
        return {
            name: envVariable.name,
            value: envVariable.value,
        };
    }

    public mapComposeFile(composeFile: any): ComposeFileInterface {
        return {
            sourceId: composeFile.sourceId,
            envDirRelativePath: composeFile.envDirRelativePath,
            composeFileRelativePaths: composeFile.composeFileRelativePaths,
        };
    }
}
