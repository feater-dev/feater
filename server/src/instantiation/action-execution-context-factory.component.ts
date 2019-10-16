import { Injectable } from '@nestjs/common';
import { PathHelper } from './helper/path-helper.component';
import { config } from '../config/config';
import { ActionExecutionContextBeforeBuildTaskInterface } from './action-execution-context/before-build/action-execution-context-before-build-task.interface';
import { AfterBuildTaskIn } from '../api/type/nested/definition-recipe/after-build-task-type.interface';
import { FeaterVariablesSet } from './sets/feater-variables-set';
import { ActionExecutionContext } from './action-execution-context/action-execution-context';
import { EnvVariablesSet } from './sets/env-variables-set';
import { SummaryItemsSet } from './sets/summary-items-set';
import { RecipeTypeInterface } from '../api/type/nested/definition-recipe/recipe-type.interface';

@Injectable()
export class ActionExecutionContextFactory {
    constructor(protected readonly pathHelper: PathHelper) {}

    create(
        id: string,
        hash: string,
        actionId: string,
        definitionRecipe: RecipeTypeInterface,
    ): ActionExecutionContext {
        const actionExecutionContext = new ActionExecutionContext(id, hash);

        actionExecutionContext.composeProjectName = `${config.instantiation.containerNamePrefix}${actionExecutionContext.hash}`;
        actionExecutionContext.paths = {
            dir: this.pathHelper.getInstancePaths(hash),
        };

        actionExecutionContext.sources = [];
        for (const sourceRecipe of definitionRecipe.sources) {
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

        actionExecutionContext.sourceVolumes = [];
        for (const sourceVolumeRecipe of definitionRecipe.sourceVolumes) {
            const sourceDockerVolumeName = `${
                actionExecutionContext.composeProjectName
            }_source_volume_${sourceVolumeRecipe.id.toLowerCase()}`;
            actionExecutionContext.sourceVolumes.push({
                id: sourceVolumeRecipe.id,
                sourceId: sourceVolumeRecipe.sourceId,
                relativePath: sourceVolumeRecipe.relativePath,
                dockerVolumeName: sourceDockerVolumeName,
            });
        }

        actionExecutionContext.assetVolumes = [];
        for (const assetVolumeRecipe of definitionRecipe.assetVolumes) {
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
        for (const proxiedPort of definitionRecipe.proxiedPorts) {
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
        for (const afterBuildTask of definitionRecipe.afterBuildTasks) {
            actionExecutionContext.afterBuildTasks.push(
                afterBuildTask as AfterBuildTaskIn,
            );
        }

        actionExecutionContext.nonInterpolatedSummaryItems = SummaryItemsSet.fromList(
            definitionRecipe.summaryItems,
        );

        actionExecutionContext.composeFiles = [];
        const composeFileRecipe = definitionRecipe.composeFiles[0];
        const composeFileVolumeName = `${actionExecutionContext.composeProjectName}_compose_file_volume`;
        actionExecutionContext.composeFiles.push({
            ...composeFileRecipe,
            dockerVolumeName: composeFileVolumeName,
        });

        const envVariables = EnvVariablesSet.fromList(
            definitionRecipe.envVariables,
        );
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
