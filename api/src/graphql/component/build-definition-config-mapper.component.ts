import {Component} from '@nestjs/common';
import {BuildDefinitionConfigTypeInterface} from '../type/build-definition-config-type.interface';
import {BuildDefinitionSourceTypeInterface} from '../type/build-definition-source-type.interface';
import {BuildDefinitionSourceReferenceTypeInterface} from '../type/build-definition-source-reference-type.interface';
import {BuildDefinitionProxiedPortTypeInterface} from '../type/build-definition-proxied-port-type.interface';
import {BuildDefinitionSummaryItemTypeInterface} from '../type/build-definition-summary-item-type.interface';
import {BuildDefinitionComposeFileTypeInterface} from '../type/build-definition-compose-file-type.interface';
import {BuildDefinitionEnvironmentalVariableTypeInterface} from '../type/build-definition-environmental-variable-type.interface';
import {
    BeforeBuildTaskTypeInterface,
    CopyBeforeBuildTaskTypeInterface,
    InterpolateBeforeBuildTaskTypeInterface
} from '../type/before-build-task-type.interface';

@Component()
export class BuildDefinitionConfigMapper {
    public map(config: any): BuildDefinitionConfigTypeInterface {
        const mappedSources: BuildDefinitionSourceTypeInterface[] = [];
        for (const sourceId of Object.keys(config.sources)) {
            mappedSources.push(this.mapSource(sourceId, config.sources[sourceId]));
        }

        let mappedProxiedPorts: BuildDefinitionProxiedPortTypeInterface[] = [];
        for (const containerName of Object.keys(config.exposedPorts)) {
            mappedProxiedPorts = mappedProxiedPorts.concat(
                this.mapProxiedPorts(containerName, config.exposedPorts[containerName]),
            );
        }

        const mappedSummaryItems: BuildDefinitionSummaryItemTypeInterface[] = [];
        for (const summaryItem of config.summaryItems) {
            mappedSummaryItems.push(this.mapSummaryItem(summaryItem));
        }

        const mappedEnvironmentalVariables: BuildDefinitionEnvironmentalVariableTypeInterface[] = [];
        if (config.environmentalVariables) {
            for (const environmentalVariableName of Object.keys(config.environmentalVariables)) {
                mappedEnvironmentalVariables.push(
                    this.mapEnvironmentalVariable(
                        environmentalVariableName,
                        config.environmentalVariables[environmentalVariableName],
                    ),
                );
            }
        }

        const mappedComposeFiles: BuildDefinitionComposeFileTypeInterface[] = [];
        if (config.composeFiles) {
            for (const composeFile of config.composeFiles) {
                mappedComposeFiles.push(this.mapComposeFile(composeFile));
            }
        } else {
            mappedComposeFiles.push(this.mapComposeFile(config.composeFile));
        }

        return {
            sources: mappedSources,
            proxiedPorts: mappedProxiedPorts,
            summaryItems: mappedSummaryItems,
            environmentalVariables: mappedEnvironmentalVariables,
            composeFiles: mappedComposeFiles,
        } as BuildDefinitionConfigTypeInterface;
    }

    protected mapSource(sourceId: string, source: any): BuildDefinitionSourceTypeInterface {
        const mappedBeforeBuildTasks: BeforeBuildTaskTypeInterface[] = [];

        if (source.beforeBuildTasks) {
            for (const beforeBuildTask of source.beforeBuildTasks) {
                mappedBeforeBuildTasks.push(this.mapBeforeBuildTask(beforeBuildTask));
            }
        }

        return {
            id: sourceId,
            type: source.type,
            name: source.name,
            reference: this.mapSourceReference(source.reference),
            beforeBuildTasks: mappedBeforeBuildTasks,
        } as BuildDefinitionSourceTypeInterface;
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

    protected mapSourceReference(reference: any): BuildDefinitionSourceReferenceTypeInterface {
        return {
            type: reference.type,
            name: reference.name,
        } as BuildDefinitionSourceReferenceTypeInterface;
    }

    protected mapProxiedPorts(containerName: string, proxiedPorts: any[]): BuildDefinitionProxiedPortTypeInterface[] {
        const mappedProxiedPorts: BuildDefinitionProxiedPortTypeInterface[] = [];

        for (const proxiedPort of proxiedPorts) {
            mappedProxiedPorts.push(this.mapProxiedPort(containerName, proxiedPort));
        }

        return mappedProxiedPorts;
    }

    protected mapProxiedPort(containerName: string, proxiedPort: any): BuildDefinitionProxiedPortTypeInterface {
        return {
            id: proxiedPort.id,
            containerName,
            port: proxiedPort.port,
            name: proxiedPort.name,
        } as BuildDefinitionProxiedPortTypeInterface;
    }

    protected mapSummaryItem(summaryItem: any): BuildDefinitionSummaryItemTypeInterface {
        return {
            name: summaryItem.name,
            text: summaryItem.value,
        } as BuildDefinitionSummaryItemTypeInterface;
    }

    protected mapEnvironmentalVariable(name: string, value: string): BuildDefinitionEnvironmentalVariableTypeInterface {
        return {
            name,
            value,
        } as BuildDefinitionEnvironmentalVariableTypeInterface;
    }

    protected mapComposeFile(composeFile: any): BuildDefinitionComposeFileTypeInterface {
        return {
            sourceId: composeFile.sourceId,
            relativePaths: composeFile.relativePaths || [composeFile.relativePath],
        } as BuildDefinitionComposeFileTypeInterface;
    }
}
