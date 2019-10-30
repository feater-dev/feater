import { Injectable } from '@nestjs/common';
import { PathHelper } from './helper/path-helper.component';
import { config } from '../config/config';
import { ActionExecutionContextBeforeBuildTaskInterface } from './action-execution-context/before-build/action-execution-context-before-build-task.interface';
import { FeaterVariablesSet } from './sets/feater-variables-set';
import { ActionExecutionContext } from './action-execution-context/action-execution-context';
import { EnvVariablesSet } from './sets/env-variables-set';
import { SummaryItemsSet } from './sets/summary-items-set';
import {
    ActionInterface,
    AfterBuildTask,
    RecipeInterface,
} from '../api/recipe/recipe.interface';

@Injectable()
export class ActionExecutionContextFactory {
    constructor(private readonly pathHelper: PathHelper) {}

    create(
        id: string,
        hash: string,
        actionId: string,
        recipe: RecipeInterface,
    ): ActionExecutionContext {
        const actionExecutionContext = new ActionExecutionContext(id, hash);

        actionExecutionContext.composeProjectName = `${config.instantiation.containerNamePrefix}${actionExecutionContext.hash}`;
        actionExecutionContext.paths = this.pathHelper.getInstancePaths(hash);

        actionExecutionContext.sources = [];
        for (const sourceRecipe of recipe.sources) {
            actionExecutionContext.sources.push({
                id: sourceRecipe.id,
                cloneUrl: sourceRecipe.cloneUrl,
                useDeployKey: sourceRecipe.useDeployKey,
                reference: {
                    type: sourceRecipe.reference.type,
                    name: sourceRecipe.reference.name,
                },
                paths: this.pathHelper.getSourcePaths(hash, sourceRecipe.id),
                dockerVolumeName: `${
                    actionExecutionContext.composeProjectName
                }_source_volume_${sourceRecipe.id.toLowerCase()}`,
                beforeBuildTasks: sourceRecipe.beforeBuildTasks.map(
                    beforeBuildTaskRecipe =>
                        beforeBuildTaskRecipe as ActionExecutionContextBeforeBuildTaskInterface,
                ),
            });
        }

        actionExecutionContext.assetVolumes = [];
        for (const assetVolumeRecipe of recipe.assetVolumes) {
            const assetDockerVolumeName = `${
                actionExecutionContext.composeProjectName
            }_asset_volume_${assetVolumeRecipe.id.toLowerCase()}`;
            actionExecutionContext.assetVolumes.push({
                id: assetVolumeRecipe.id,
                assetId: assetVolumeRecipe.assetId,
                dockerVolumeName: assetDockerVolumeName,
            });
        }

        actionExecutionContext.proxiedPorts = [];
        for (const proxiedPort of recipe.proxiedPorts) {
            actionExecutionContext.proxiedPorts.push({
                id: proxiedPort.id,
                serviceId: proxiedPort.serviceId,
                name: proxiedPort.name,
                port: proxiedPort.port,
                nginxConfigTemplate: proxiedPort.nginxConfigTemplate,
            });
        }

        actionExecutionContext.services = [];

        actionExecutionContext.afterBuildTasks = [];
        const action = recipe.actions.find(
            (action: ActionInterface): boolean => action.id === actionId,
        );
        if (!action) {
            throw new Error('Missing action.');
        }
        for (const afterBuildTask of action.afterBuildTasks) {
            actionExecutionContext.afterBuildTasks.push(
                afterBuildTask as AfterBuildTask,
            );
        }

        actionExecutionContext.nonInterpolatedSummaryItems = SummaryItemsSet.fromList(
            recipe.summaryItems,
        );

        actionExecutionContext.downloadables = [];
        for (const downloadable of recipe.downloadables) {
            actionExecutionContext.downloadables.push({
                id: downloadable.id,
                name: downloadable.name,
                serviceId: downloadable.serviceId,
                absolutePath: downloadable.absolutePath,
            });
        }

        actionExecutionContext.composeFiles = [];
        const composeFileRecipe = recipe.composeFiles[0];
        actionExecutionContext.composeFiles.push({ ...composeFileRecipe });

        const envVariables = EnvVariablesSet.fromList(recipe.envVariables);
        const featerVariables = new FeaterVariablesSet();

        // Add Feater variables for env variables provided in definition.
        for (const envVariable of envVariables.toList()) {
            featerVariables.add(
                `env__${envVariable.name.toLowerCase()}`,
                envVariable.value,
            );
        }

        // Add some basic Feater variables and env variables.
        envVariables.add('FEATER__INSTANCE_ID', actionExecutionContext.id);
        featerVariables.add('instance_id', actionExecutionContext.id);
        envVariables.add('FEATER__INSTANCE_HASH', actionExecutionContext.hash);
        featerVariables.add('instance_hash', actionExecutionContext.hash);

        envVariables.add(
            'COMPOSE_PROJECT_NAME',
            actionExecutionContext.composeProjectName,
        );
        featerVariables.add(
            'compose_project_name',
            actionExecutionContext.composeProjectName,
        );

        actionExecutionContext.mergeEnvVariablesSet(envVariables);
        actionExecutionContext.mergeFeaterVariablesSet(featerVariables);

        return actionExecutionContext;
    }
}
