import {Injectable} from '@nestjs/common';
import {PathHelper} from './helper/path-helper.component';
import {environment} from '../environment/environment';
import {InstanceContextBeforeBuildTaskInterface} from './instance-context/before-build/instance-context-before-build-task.interface';
import {AfterBuildTaskTypeInterface} from '../graphql/type/nested/definition-config/after-build-task-type.interface';
import {FeaterVariablesSet} from './sets/feater-variables-set';
import {InstanceContext} from './instance-context/instance-context';

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

        instanceContext.composeProjectName = `${environment.instantiation.containerNamePrefix}${instanceContext.hash}`;
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
                sshCloneUrl: sourceConfig.sshCloneUrl,
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

        instanceContext.envVariables = definitionConfig.envVariables;

        instanceContext.afterBuildTasks = [];
        for (const afterBuildTask of definitionConfig.afterBuildTasks) {
            instanceContext.afterBuildTasks.push(afterBuildTask as AfterBuildTaskTypeInterface);
        }

        instanceContext.summaryItems = definitionConfig.summaryItems;

        instanceContext.composeFiles = [];
        for (const composeFileConfig of definitionConfig.composeFiles) {
            instanceContext.composeFiles.push(composeFileConfig);
        }

        const featerVariables = new FeaterVariablesSet();
        featerVariables.add('scheme', environment.app.scheme);
        featerVariables.add('host', environment.app.host);
        featerVariables.add('npm_cache', environment.hostPaths.npmCache);
        featerVariables.add('composer_cache', environment.hostPaths.composerCache);
        featerVariables.add('instance_id', instanceContext.id);
        featerVariables.add('instance_hash', instanceContext.hash);
        instanceContext.mergeFeaterVariablesSet(featerVariables);

        return instanceContext;
    }

}
