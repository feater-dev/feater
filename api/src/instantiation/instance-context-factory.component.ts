import {Injectable} from '@nestjs/common';
import {PathHelper} from './helper/path-helper.component';
import {config} from '../config/config';
import {InstanceContextBeforeBuildTaskInterface} from './instance-context/before-build/instance-context-before-build-task.interface';
import {AfterBuildTaskTypeInterface} from '../graphql/type/nested/definition-config/after-build-task-type.interface';
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
        definitionConfig: any, // TODO
    ): InstanceContext {
        const instanceContext = new InstanceContext(id, hash);

        instanceContext.composeProjectName = `${config.instantiation.containerNamePrefix}${instanceContext.hash}`;
        instanceContext.paths = {
            dir: this.pathHelper.getInstancePaths(hash),
        };

        instanceContext.volumes = [];
        for (const volumeConfig of definitionConfig.volumes) {
            instanceContext.volumes.push({
                id: volumeConfig.id,
                assetId: volumeConfig.assetId,
                paths: {
                    extractDir: this.pathHelper.getAssetExtractPaths(hash, volumeConfig.assetId),
                },
            });
        }

        instanceContext.sources = [];
        for (const sourceConfig of definitionConfig.sources) {
            instanceContext.sources.push({
                id: sourceConfig.id,
                cloneUrl: sourceConfig.cloneUrl,
                reference: {
                    type: sourceConfig.reference.type,
                    name: sourceConfig.reference.name,
                },
                paths: {
                    dir: this.pathHelper.getSourcePaths(hash, sourceConfig.id),
                },
                beforeBuildTasks: sourceConfig.beforeBuildTasks.map(
                    (beforeBuildTaskConfig) => beforeBuildTaskConfig as InstanceContextBeforeBuildTaskInterface,
                ),
            });
        }

        instanceContext.proxiedPorts = [];
        for (const proxiedPort of definitionConfig.proxiedPorts) {
            instanceContext.proxiedPorts.push({
                id: proxiedPort.id,
                serviceId: proxiedPort.serviceId,
                name: proxiedPort.name,
                port: proxiedPort.port,
            });
        }

        instanceContext.services = [];

        instanceContext.afterBuildTasks = [];
        for (const afterBuildTask of definitionConfig.afterBuildTasks) {
            instanceContext.afterBuildTasks.push(afterBuildTask as AfterBuildTaskTypeInterface);
        }

        instanceContext.nonInterpolatedSummaryItems = SummaryItemsSet.fromList(definitionConfig.summaryItems);

        instanceContext.composeFiles = [];
        for (const composeFileConfig of definitionConfig.composeFiles) {
            instanceContext.composeFiles.push(composeFileConfig);
        }

        const envVariables = EnvVariablesSet.fromList(definitionConfig.envVariables);
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
