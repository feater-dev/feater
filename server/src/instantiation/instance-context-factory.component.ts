import {Injectable} from '@nestjs/common';
import {PathHelper} from './helper/path-helper.component';
import {config} from '../config/config';
import {InstanceContextBeforeBuildTaskInterface} from './instance-context/before-build/instance-context-before-build-task.interface';
import {AfterBuildTaskTypeInterface} from '../api/type/nested/definition-recipe/after-build-task-type.interface';
import {FeaterVariablesSet} from './sets/feater-variables-set';
import {InstanceContext} from './instance-context/instance-context';
import {EnvVariablesSet} from './sets/env-variables-set';
import {SummaryItemsSet} from './sets/summary-items-set';

@Injectable()
export class InstanceContextFactory {

    constructor(
        protected readonly pathHelper: PathHelper,
    ) {}

    create(
        id: string,
        hash: string,
        definitionRecipe: any,
    ): InstanceContext {
        const instanceContext = new InstanceContext(id, hash);

        instanceContext.composeProjectName = `${config.instantiation.containerNamePrefix}${instanceContext.hash}`;
        instanceContext.paths = {
            dir: this.pathHelper.getInstancePaths(hash),
        };

        instanceContext.sources = [];
        for (const sourceRecipe of definitionRecipe.sources) {
            instanceContext.sources.push({
                id: sourceRecipe.id,
                cloneUrl: sourceRecipe.cloneUrl,
                useDeployKey: sourceRecipe.useDeployKey,
                reference: {
                    type: sourceRecipe.reference.type,
                    name: sourceRecipe.reference.name,
                },
                paths: this.pathHelper.getSourcePaths(hash, sourceRecipe.id),
                dockerVolumeName: `${instanceContext.composeProjectName}_source_volume_${sourceRecipe.id.toLowerCase()}`,
                beforeBuildTasks: sourceRecipe.beforeBuildTasks.map(
                    (beforeBuildTaskRecipe) => beforeBuildTaskRecipe as InstanceContextBeforeBuildTaskInterface,
                ),
            });
        }

        instanceContext.sourceVolumes = [];
        for (const sourceVolumeRecipe of definitionRecipe.sourceVolumes) {
            const sourceDockerVolumeName = `${instanceContext.composeProjectName}_source_volume_${sourceVolumeRecipe.id.toLowerCase()}`;
            instanceContext.sourceVolumes.push({
                id: sourceVolumeRecipe.id,
                sourceId: sourceVolumeRecipe.sourceId,
                relativePath: sourceVolumeRecipe.relativePath,
                dockerVolumeName: sourceDockerVolumeName,
            });
        }

        instanceContext.assetVolumes = [];
        for (const assetVolumeRecipe of definitionRecipe.assetVolumes) {
            const assetDockerVolumeName = `${instanceContext.composeProjectName}_asset_volume_${assetVolumeRecipe.id.toLowerCase()}`;
            instanceContext.assetVolumes.push({
                id: assetVolumeRecipe.id,
                assetId: assetVolumeRecipe.assetId,
                dockerVolumeName: assetDockerVolumeName,
            });
        }

        instanceContext.proxiedPorts = [];
        for (const proxiedPort of definitionRecipe.proxiedPorts) {
            instanceContext.proxiedPorts.push({
                id: proxiedPort.id,
                serviceId: proxiedPort.serviceId,
                name: proxiedPort.name,
                port: proxiedPort.port,
                nginxConfigTemplate: proxiedPort.nginxConfigTemplate,
            });
        }

        instanceContext.services = [];

        instanceContext.afterBuildTasks = [];
        for (const afterBuildTask of definitionRecipe.afterBuildTasks) {
            instanceContext.afterBuildTasks.push(afterBuildTask as AfterBuildTaskTypeInterface);
        }

        instanceContext.nonInterpolatedSummaryItems = SummaryItemsSet.fromList(definitionRecipe.summaryItems);

        instanceContext.composeFiles = [];
        const composeFileRecipe = definitionRecipe.composeFiles[0];
        const composeFileVolumeName = `${instanceContext.composeProjectName}_compose_file_volume`;
        instanceContext.composeFiles.push({
            ...composeFileRecipe,
            dockerVolumeName: composeFileVolumeName,
        });

        const envVariables = EnvVariablesSet.fromList(definitionRecipe.envVariables);
        const featerVariables = new FeaterVariablesSet();

        // Add Feater variables for env variables provided in definition.
        for (const envVariable of envVariables.toList()) {
            featerVariables.add(`env__${envVariable.name.toLowerCase()}`, envVariable.value);
        }

        // Add some basic Feater variables and env variables.
        envVariables.add('FEATER__INSTANCE_ID', instanceContext.id);
        featerVariables.add('instance_id', instanceContext.id);
        envVariables.add('FEATER__INSTANCE_HASH', instanceContext.hash);
        featerVariables.add('instance_hash', instanceContext.hash);

        envVariables.add('COMPOSE_PROJECT_NAME', instanceContext.composeProjectName);
        featerVariables.add('compose_project_name', instanceContext.composeProjectName);

        instanceContext.mergeEnvVariablesSet(envVariables);
        instanceContext.mergeFeaterVariablesSet(featerVariables);

        return instanceContext;
    }

}
