import {Injectable} from '@nestjs/common';
import {PredictedEnvVariableInterface} from './predicted-env-variable.interface';
import {PredictedFeaterVariableInterface} from './predicted-feater-variable.interface';
import {config} from '../../config/config';
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
                pattern: `${config.instantiation.containerNamePrefix}{instance_hash}`,
            },
        ]);

        const proxiedPortIds = _.filter(_.map(definitionConfig.proxiedPorts, 'id'));
        envVariables.push(
            proxiedPortIds.map(
                (proxiedPortId: string): PredictedEnvVariableInterface => {
                    return {
                        name: `FEATER__PROXY_DOMAIN__${proxiedPortId.toUpperCase()}`,
                        pattern: config.instantiation.proxyDomainPattern.replace('{port_id}', proxiedPortId.toLowerCase()),
                    };
                },
            ),
        );

        const sourceIds = _.filter(_.map(definitionConfig.sources, 'id'));
        envVariables.push(
            sourceIds.map(
                (sourceId: string): PredictedEnvVariableInterface[] => {
                    return [
                        // TODO Depracted, remove later. Replaced volume name below.
                        {
                            name: `FEATER__HOST_SOURCE_PATH__${sourceId.toUpperCase()}`,
                            pattern: '',
                        },
                        {
                            name: `FEATER__SOURCE_MOUNTPOINT__${sourceId.toUpperCase()}`,
                            pattern: '',
                        },
                        {
                            name: `FEATER__SOURCE_VOLUME__${sourceId.toUpperCase()}`,
                            pattern: `${config.instantiation.containerNamePrefix}_{instance_hash}_source_volume_${sourceId.toLowerCase()}`, // TODO Move to some helper.
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
                        pattern: `${config.instantiation.containerNamePrefix}{instance_hash}_${volumeId.toLowerCase()}`,
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
                pattern: `${config.instantiation.containerNamePrefix}{instance_hash}`,
            },
        ]);

        const proxiedPortIds = _.filter(_.map(definitionConfig.proxiedPorts, 'id'));
        featerVariables.push(
            proxiedPortIds.map(
                (proxiedPortId: string): PredictedFeaterVariableInterface => {
                    return {
                        name: `proxy_domain__${proxiedPortId.toLowerCase()}`,
                        pattern: config.instantiation.proxyDomainPattern.replace('{port_id}', proxiedPortId.toLowerCase()),
                    };
                },
            ),
        );

        const sourceIds = _.filter(_.map(definitionConfig.sources, 'id'));
        featerVariables.push(
            sourceIds.map(
                (sourceId: string): PredictedFeaterVariableInterface[] => {
                    return [
                        // TODO Depracted, remove later. Replaced volume name below.
                        {
                            name: `host_source_path__${sourceId.toLowerCase()}`,
                            pattern: '',
                        },
                        {
                            name: `source_mountpoint__${sourceId.toLowerCase()}`,
                            pattern: '',
                        },
                        {
                            name: `source_volume__${sourceId.toLowerCase()}`,
                            pattern: `${config.instantiation.containerNamePrefix}_{instance_hash}_source_volume_${sourceId.toLowerCase()}`, // TODO Move to some helper.
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
                        pattern: `${config.instantiation.containerNamePrefix}{instance_hash}_${volumeId.toLowerCase()}`,
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
