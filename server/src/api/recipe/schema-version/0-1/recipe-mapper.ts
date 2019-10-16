import { Injectable } from '@nestjs/common';
import {
    ActionInterface,
    AssetVolumeInterface,
    ComposeFileInterface,
    DownloadableInterface,
    EnvVariableInterface,
    ProxiedPortInterface,
    RecipeInterface,
    SourceInterface,
    SourceVolumeInterface,
    SummaryItemInterface,
} from '../../recipe.interface';
import * as jsYaml from 'js-yaml';
import * as camelCaseKeys from 'camelcase-keys';
import { RecipePartMapper } from './recipe-part-mapper';

@Injectable()
export class RecipeMapper {
    private readonly supportedSchemaVersion = '0.1';

    constructor(private readonly recipePartMapper: RecipePartMapper) {}

    map(recipeAsYaml: string): RecipeInterface {
        const rawRecipe: any = camelCaseKeys(jsYaml.safeLoad(recipeAsYaml), {
            deep: true,
        });

        if (!rawRecipe.schemaVersion) {
            throw new Error('Missing schema version.');
        }

        if (this.supportedSchemaVersion !== rawRecipe.schemaVersion) {
            throw new Error(
                `Unsupported schema version ${rawRecipe.schemaVersion}.`,
            );
        }

        const mappedSources: SourceInterface[] = [];
        for (const source of rawRecipe.sources) {
            mappedSources.push(this.recipePartMapper.mapSource(source));
        }

        const mappedAssetVolumes: AssetVolumeInterface[] = [];
        for (const assetVolume of rawRecipe.assetVolumes) {
            mappedAssetVolumes.push(
                this.recipePartMapper.mapAssetVolume(assetVolume),
            );
        }

        const mappedSourceVolumes: SourceVolumeInterface[] = [];
        for (const sourceVolume of rawRecipe.sourceVolumes) {
            mappedSourceVolumes.push(
                this.recipePartMapper.mapSourceVolume(sourceVolume),
            );
        }

        const mappedEnvVariables: EnvVariableInterface[] = [];
        if (rawRecipe.envVariables) {
            for (const envVariable of rawRecipe.envVariables) {
                mappedEnvVariables.push(
                    this.recipePartMapper.mapEnvVariable(envVariable),
                );
            }
        }

        const mappedComposeFiles: ComposeFileInterface[] = [];
        if (rawRecipe.composeFiles) {
            for (const composeFile of rawRecipe.composeFiles) {
                mappedComposeFiles.push(
                    this.recipePartMapper.mapComposeFile(composeFile),
                );
            }
        }

        const mappedProxiedPorts: ProxiedPortInterface[] = [];
        for (const proxiedPort of rawRecipe.proxiedPorts) {
            mappedProxiedPorts.push(
                this.recipePartMapper.mapProxiedPort(proxiedPort),
            );
        }

        const mappedActions: ActionInterface[] = [];
        for (const action of rawRecipe.actions) {
            mappedActions.push(this.recipePartMapper.mapAction(action));
        }

        const mappedDownloadables: DownloadableInterface[] = [];
        for (const downloadable of rawRecipe.downloadables) {
            mappedDownloadables.push(
                this.recipePartMapper.mapDownloadable(downloadable),
            );
        }

        const mappedSummaryItems: SummaryItemInterface[] = [];
        for (const summaryItem of rawRecipe.summaryItems) {
            mappedSummaryItems.push(
                this.recipePartMapper.mapSummaryItem(summaryItem),
            );
        }

        return {
            sources: mappedSources,
            sourceVolumes: mappedSourceVolumes,
            assetVolumes: mappedAssetVolumes,
            proxiedPorts: mappedProxiedPorts,
            envVariables: mappedEnvVariables,
            composeFiles: mappedComposeFiles,
            actions: mappedActions,
            downloadables: mappedDownloadables,
            summaryItems: mappedSummaryItems,
        };
    }
}
