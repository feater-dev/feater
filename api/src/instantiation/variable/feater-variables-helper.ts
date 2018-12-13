import {environment} from '../../environments/environment';
import {Injectable} from '@nestjs/common';
import {FeaterVariablesSet} from '../sets/feater-variables-set';
import {VariablesContextInterface} from './variables-context.interface';
import * as _ from 'lodash';
import * as path from 'path';

@Injectable()
export class FeaterVariablesHelper {

    protected INSTANCE_ID_VARIABLE_NAME = 'instance_id';
    protected INSTANCE_HASH_VARIABLE_NAME = 'instance_hash';
    protected COMPOSE_PROJECT_NAME_VARIABLE_NAME = 'compose_project_name';
    protected GUEST_SOURCE_PATH_VARIABLE_NAME = 'guest_source_path__{{{source_id}}}';
    protected HOST_SOURCE_PATH_VARIABLE_NAME = 'host_source_path__{{{source_id}}}';
    protected ASSET_VOLUME_VARIABLE_NAME = 'asset_volume__{{{volume_id}}}';
    protected PROXY_DOMAIN_VARIABLE_NAME = 'proxy_domain__{{{port_id}}}';
    protected CONTAINER_ID_VARIABLE_NAME = 'container_id__{{{service_id}}}';

    getVariables(context: VariablesContextInterface): FeaterVariablesSet {
        const featerVariables = new FeaterVariablesSet();
        const supplementedContext = this.supplementContext(context);

        const composeProjectName = environment.instantiation.composeProjectNamePattern
            .replace('{{{instance_hash}}}', supplementedContext.instanceHash);

        featerVariables.add(this.INSTANCE_ID_VARIABLE_NAME, supplementedContext.instanceId);
        featerVariables.add(this.INSTANCE_HASH_VARIABLE_NAME, supplementedContext.instanceHash);
        featerVariables.add(this.COMPOSE_PROJECT_NAME_VARIABLE_NAME, composeProjectName);

        for (const source of supplementedContext.sources) {
            featerVariables.add(
                this.GUEST_SOURCE_PATH_VARIABLE_NAME
                    .replace('{{{source_id}}}', source.id.toLowerCase()),
                path.join(
                    environment.guestPaths.build,
                    supplementedContext.instanceHash,
                    source.id,
                ),
            );
            featerVariables.add(
                this.HOST_SOURCE_PATH_VARIABLE_NAME
                    .replace('{{{source_id}}}', source.id.toLowerCase()),
                path.join(
                    environment.hostPaths.build,
                    supplementedContext.instanceHash,
                    source.id,
                ),
            );
        }

        for (const volume of supplementedContext.volumes) {
            featerVariables.add(
                this.ASSET_VOLUME_VARIABLE_NAME
                    .replace('{{{volume_id}}}', volume.id.toLowerCase()),
                `${composeProjectName}_${volume.id.toLowerCase()}`,
            );
        }

        for (const proxiedPort of supplementedContext.proxiedPorts) {
            featerVariables.add(
                this.PROXY_DOMAIN_VARIABLE_NAME
                    .replace('{{{port_id}}}', proxiedPort.id.toLowerCase()),
                environment.instantiation.proxyDomainPattern
                    .replace('{{{instance_hash}}}', supplementedContext.instanceHash)
                    .replace('{{{port_id}}}', proxiedPort.id),
            );
        }

        for (const service of supplementedContext.services) {
            featerVariables.add(
                this.CONTAINER_ID_VARIABLE_NAME
                    .replace('{{{service_id}}}', service.id.toLowerCase),
                service.containerId,
            );
        }

        return featerVariables;
    }

    protected getSubstitutionToken(name: string): string {
        return `{{{${name}}}}`;
    }

    protected supplementContext(context: VariablesContextInterface): VariablesContextInterface {
        const supplementedContext = _.cloneDeep(context);
        if (!supplementedContext.instanceId) {
            supplementedContext.instanceId = this.getSubstitutionToken(this.INSTANCE_ID_VARIABLE_NAME);
        }
        if (!supplementedContext.instanceHash) {
            supplementedContext.instanceHash = this.getSubstitutionToken(this.INSTANCE_HASH_VARIABLE_NAME);
        }
        for (const service of supplementedContext.services) {
            service.containerId = '';
        }

        return supplementedContext;
    }

}
