import {Injectable} from '@nestjs/common';
import {PredictedEnvVariableInterface} from './predicted-env-variable.interface';
import {PredictedFeaterVariableInterface} from './predicted-feater-variable.interface';
import {environment} from '../../environments/environment';
import * as path from 'path';
import * as _ from 'lodash';
import {InterpolationHelper} from '../helper/interpolation-helper.component';
import {FeaterVariablesSet} from '../sets/feater-variables-set';
import {FeaterVariablesHelper} from './feater-variables-helper';
import {EnvVariablesHelper} from './env-variables-helper';
import {EnvVariablesSet} from '../sets/env-variables-set';
import {InstanceContext} from '../instance-context/instance-context';
import {VariablesContextInterface} from './variables-context.interface';

@Injectable()
export class VariablesProvider {

    constructor(
        protected featerVariablesHelper: FeaterVariablesHelper,
        protected evnVariablesHelper: EnvVariablesHelper,
    ) {}

    provideEnvVariablesForDefintion(definitionConfig: any): EnvVariablesSet {
        return this.evnVariablesHelper.getVariables(
            this.createVariablesContextForDefinition(definitionConfig),
        );
    }

    provideFeaterVariablesForDefintion(definitionConfig: any): FeaterVariablesSet {
        return this.featerVariablesHelper.getVariables(
            this.createVariablesContextForDefinition(definitionConfig),
        );
    }

    provideEnvVariablesForInstance(instanceContext: InstanceContext): EnvVariablesSet {
        return this.evnVariablesHelper.getVariables(
            this.createVariablesContextForInstance(instanceContext),
        );
    }

    provideFeaterVariablesForInstance(instanceContext: InstanceContext): FeaterVariablesSet {
        return this.featerVariablesHelper.getVariables(
            this.createVariablesContextForInstance(instanceContext),
        );
    }

    protected createVariablesContextForDefinition(definitionConfig: any): VariablesContextInterface {
        return {
            sources: definitionConfig.sources.map(source => ({id: source.id})),
            volumes: definitionConfig.volumes.map(volume => ({id: volume.id})),
            proxiedPorts: definitionConfig.proxiedPorts.map(proxiedPort => ({id: proxiedPort.id})),
            services: [],
        };
    }

    protected createVariablesContextForInstance(instanceContext: InstanceContext): VariablesContextInterface {
        return {
            instanceId: instanceContext.id,
            instanceHash: instanceContext.hash,
            sources: instanceContext.sources.map(source => ({id: source.id})),
            volumes: instanceContext.volumes.map(volume => ({id: volume.id})),
            proxiedPorts: instanceContext.proxiedPorts.map(proxiedPort => ({id: proxiedPort.id})),
            services: [],
        };
    }
}
