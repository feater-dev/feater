import {Component} from '@nestjs/common';
import {ConfigTypeInterface} from '../type/nested/build-definition-config/config-type.interface';
import {SourceTypeInterface} from '../type/nested/build-definition-config/source-type.interface';
import {SourceReferenceTypeInterface} from '../type/nested/build-definition-config/source-reference-type.interface';
import {ProxiedPortTypeInterface} from '../type/nested/build-definition-config/proxied-port-type.interface';
import {SummaryItemTypeInterface} from '../type/nested/build-definition-config/summary-item-type.interface';
import {ComposeFileTypeInterface} from '../type/nested/build-definition-config/compose-file-type.interface';
import {EnvironmentalVariableTypeInterface} from '../type/nested/build-definition-config/environmental-variable-type.interface';
import {
    BeforeBuildTaskTypeInterface,
    CopyBeforeBuildTaskTypeInterface,
    InterpolateBeforeBuildTaskTypeInterface
} from '../type/nested/build-definition-config/before-build-task-type.interface';

@Component()
export class BuildDefinitionConfigMapper {
    public map(config: any): ConfigTypeInterface {
        const mappedSources: SourceTypeInterface[] = [];
        for (const source of config.sources) {
            mappedSources.push(this.mapSource(source));
        }

        let mappedProxiedPorts: ProxiedPortTypeInterface[] = [];
        for (const proxiedPort of config.proxiedPorts) {
            mappedProxiedPorts = mappedProxiedPorts.concat(
                this.mapProxiedPorts(config.proxiedPorts),
            );
        }

        const mappedSummaryItems: SummaryItemTypeInterface[] = [];
        for (const summaryItem of config.summaryItems) {
            mappedSummaryItems.push(this.mapSummaryItem(summaryItem));
        }

        const mappedEnvironmentalVariables: EnvironmentalVariableTypeInterface[] = [];
        if (config.environmentalVariables) {
            for (const environmentalVariable of config.environmentalVariables) {
                mappedEnvironmentalVariables.push(
                    this.mapEnvironmentalVariable(environmentalVariable),
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

        return {
            sources: mappedSources,
            proxiedPorts: mappedProxiedPorts,
            summaryItems: mappedSummaryItems,
            environmentalVariables: mappedEnvironmentalVariables,
            composeFiles: mappedComposeFiles,
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
            type: source.type,
            name: source.name,
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

    protected mapSourceReference(reference: any): SourceReferenceTypeInterface {
        return {
            type: reference.type,
            name: reference.name,
        } as SourceReferenceTypeInterface;
    }

    protected mapProxiedPorts(proxiedPorts: any[]): ProxiedPortTypeInterface[] {
        const mappedProxiedPorts: ProxiedPortTypeInterface[] = [];

        for (const proxiedPort of proxiedPorts) {
            mappedProxiedPorts.push(proxiedPort as ProxiedPortTypeInterface);
        }

        return mappedProxiedPorts;
    }

    protected mapSummaryItem(summaryItem: any): SummaryItemTypeInterface {
        return {
            name: summaryItem.name,
            text: summaryItem.text,
        } as SummaryItemTypeInterface;
    }

    protected mapEnvironmentalVariable(environmentalVariable: any): EnvironmentalVariableTypeInterface {
        return environmentalVariable as EnvironmentalVariableTypeInterface;
    }

    protected mapComposeFile(composeFile: any): ComposeFileTypeInterface {
        return composeFile as ComposeFileTypeInterface;
    }
}
