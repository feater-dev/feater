import { Injectable } from '@nestjs/common';
import { PredictedEnvVariableInterface } from './predicted-env-variable.interface';
import { PredictedFeaterVariableInterface } from './predicted-feater-variable.interface';
import { config } from '../../config/config';
import * as path from 'path';
import * as _ from 'lodash';
import { RecipeInterface } from '../../api/recipe/recipe.interface';

interface UnflattenedArray<T> extends Array<T | UnflattenedArray<T>> {}

@Injectable()
export class VariablesPredictor {
    predictEnvVariables(
        recipe: RecipeInterface,
    ): PredictedEnvVariableInterface[] {
        const envVariables: UnflattenedArray<
            PredictedEnvVariableInterface
        > = [];

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

        const proxiedPortIds = _.filter(_.map(recipe.proxiedPorts, 'id'));
        envVariables.push(
            proxiedPortIds.map(
                (proxiedPortId: string): PredictedEnvVariableInterface => {
                    return {
                        name: `FEATER__PROXY_DOMAIN__${proxiedPortId.toUpperCase()}`,
                        pattern: config.instantiation.proxyDomainPattern.replace(
                            '{port_id}',
                            proxiedPortId.toLowerCase(),
                        ),
                    };
                },
            ),
        );

        const sourceIds = _.filter(_.map(recipe.sources, 'id'));
        envVariables.push(
            sourceIds.map(
                (sourceId: string): PredictedEnvVariableInterface[] => {
                    return [
                        {
                            name: `FEATER__SOURCE_MOUNT__${sourceId.toUpperCase()}`,
                            pattern: '',
                        },
                    ];
                },
            ),
        );

        const volumeIds = _.filter(_.map(recipe.assetVolumes, 'id'));
        envVariables.push(
            volumeIds.map(
                (volumeId: string): PredictedEnvVariableInterface => {
                    return {
                        name: `FEATER__ASSET_VOLUME__${volumeId.toUpperCase()}`,
                        pattern: `${
                            config.instantiation.containerNamePrefix
                        }{instance_hash}_asset_volume_${volumeId.toLowerCase()}`,
                    };
                },
            ),
        );

        // TODO Add FEATER__CONTAINER_ID__{service_id} when possible.

        return _.flattenDeep(envVariables);
    }

    predictFeaterVariables(
        recipe: RecipeInterface,
    ): PredictedFeaterVariableInterface[] {
        const featerVariables: UnflattenedArray<
            PredictedFeaterVariableInterface
        > = [];

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

        featerVariables.push(
            recipe.envVariables.map(
                (envVariable: {
                    name: string;
                    value: string;
                }): PredictedFeaterVariableInterface => {
                    return {
                        name: `env__${envVariable.name.toLowerCase()}`,
                        value: envVariable.value,
                    };
                },
            ),
        );

        const proxiedPortIds = _.filter(_.map(recipe.proxiedPorts, 'id'));
        featerVariables.push(
            proxiedPortIds.map(
                (proxiedPortId: string): PredictedFeaterVariableInterface => {
                    return {
                        name: `proxy_domain__${proxiedPortId.toLowerCase()}`,
                        pattern: config.instantiation.proxyDomainPattern.replace(
                            '{port_id}',
                            proxiedPortId.toLowerCase(),
                        ),
                    };
                },
            ),
        );

        const sourceIds = _.filter(_.map(recipe.sources, 'id'));
        featerVariables.push(
            sourceIds.map(
                (sourceId: string): PredictedFeaterVariableInterface[] => {
                    return [
                        {
                            name: `source_mount__${sourceId.toLowerCase()}`,
                            pattern: '',
                        },
                    ];
                },
            ),
        );

        const volumeIds = _.filter(_.map(recipe.assetVolumes, 'id'));
        featerVariables.push(
            volumeIds.map(
                (volumeId: string): PredictedFeaterVariableInterface => {
                    return {
                        name: `asset_volume__${volumeId.toLowerCase()}`,
                        pattern: `${
                            config.instantiation.containerNamePrefix
                        }{instance_hash}_asset_volume_${volumeId.toLowerCase()}`,
                    };
                },
            ),
        );

        // TODO Add container_id__{service_id} when possible.

        return _.flattenDeep(featerVariables);
    }
}
