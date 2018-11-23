import {Injectable} from '@nestjs/common';
import {PredictedEnvVariableInterface} from './predicted-env-variable.interface';
import {PredictedFeaterVariableInterface} from './predicted-feater-variable.interface';
import {environment} from '../../environments/environment';
import * as path from 'path';
import * as _ from 'lodash';

@Injectable()
export class VariablesPredictor {

    predictEnvVariables(definitionConfig: any): PredictedEnvVariableInterface[] {
        const envVariables: any = [];

        envVariables.push([
            {
                name: 'FEATER__INSTANCE_ID',
                pattern: '{instance_id}',
            },
            {
                name: 'FEATER__INSTANCE_HASH',
                pattern: '{instance_hash}',
            },
            {
                name: 'COMPOSE_PROJECT_NAME',
                pattern: `${environment.instantiation.containerNamePrefix}{instance_hash}`,
            },
        ]);

        const proxiedPortIds = _.filter(_.map(definitionConfig.proxiedPorts, 'id'));
        envVariables.push(
            proxiedPortIds.map(
                (proxiedPortId: string): PredictedEnvVariableInterface => {
                    return {
                        name: `FEATER__PROXY_DOMAIN__${proxiedPortId.toUpperCase()}`,
                        pattern: environment.instantiation.proxyDomainPattern.replace('{port_id}', proxiedPortId.toLowerCase()),
                    };
                },
            ),
        );

        const sourceIds = _.filter(_.map(definitionConfig.sources, 'id'));
        envVariables.push(
            sourceIds.map(
                (sourceId: string): PredictedEnvVariableInterface[] => {
                    return [
                        {
                            name: `FEATER__HOST_SOURCE_PATH__${sourceId.toUpperCase()}`,
                            pattern: path.join(environment.hostPaths.build, '{instance_hash}', sourceId.toLowerCase()),
                        },
                        {
                            name: `FEATER__GUEST_SOURCE_PATH__${sourceId.toUpperCase()}`,
                            pattern: path.join(environment.guestPaths.build, '{instance_hash}', sourceId.toLowerCase()),
                        },
                    ];
                },
            ),
        );

        const volumeIds = _.filter(_.map(definitionConfig.volumes, 'id'));
        envVariables.push(
            volumeIds.map(
                (volumeId: string): PredictedEnvVariableInterface => {
                    return {
                        name: `FEATER__ASSET_VOLUME__${volumeId.toUpperCase()}`,
                        pattern: `${environment.instantiation.containerNamePrefix}{instance_hash}_${volumeId.toLowerCase()}`,
                    };
                },
            ),
        );

        // TODO Add FEATER__CONTAINER_ID__{service_id}
        //      It's not possible to establish without fetching `docker-compose` configuration and parsing it.
        //      To be added when we have local clones of repositories available.

        return _.flattenDeep(envVariables);
    }

    predictFeaterVariables(definitionConfig: any): PredictedFeaterVariableInterface[] {
        const featerVariables: any = [];

        featerVariables.push([
            {
                name: 'instance_id',
                pattern: '{instance_id}',
            },
            {
                name: 'instance_hash',
                pattern: '{instance_hash}',
            },
            {
                name: 'compose_project_name',
                pattern: `${environment.instantiation.containerNamePrefix}{instance_hash}`,
            },
        ]);

        const proxiedPortIds = _.filter(_.map(definitionConfig.proxiedPorts, 'id'));
        featerVariables.push(
            proxiedPortIds.map(
                (proxiedPortId: string): PredictedFeaterVariableInterface => {
                    return {
                        name: `proxy_domain__${proxiedPortId.toLowerCase()}`,
                        pattern: environment.instantiation.proxyDomainPattern.replace('{port_id}', proxiedPortId.toLowerCase()),
                    };
                },
            ),
        );

        const sourceIds = _.filter(_.map(definitionConfig.sources, 'id'));
        featerVariables.push(
            sourceIds.map(
                (sourceId: string): PredictedFeaterVariableInterface[] => {
                    return [
                        {
                            name: `host_source_path__${sourceId.toLowerCase()}`,
                            pattern: path.join(environment.hostPaths.build, '{instance_hash}', sourceId.toLowerCase()),
                        },
                        {
                            name: `guest_source_path__${sourceId.toLowerCase()}`,
                            pattern: path.join(environment.guestPaths.build, '{instance_hash}', sourceId.toLowerCase()),
                        },
                    ];
                },
            ),
        );

        const volumeIds = _.filter(_.map(definitionConfig.volumes, 'id'));
        featerVariables.push(
            volumeIds.map(
                (volumeId: string): PredictedFeaterVariableInterface => {
                    return {
                        name: `asset_volume__${volumeId.toLowerCase()}`,
                        pattern: `${environment.instantiation.containerNamePrefix}{instance_hash}_${volumeId.toLowerCase()}`,
                    };
                },
            ),
        );

        // TODO Add container_id__{service_id}
        //      It's not possible to establish without fetching `docker-compose` configuration and parsing it.
        //      To be added when we have local clones of repositories available.

        return _.flattenDeep(featerVariables);
    }
}
