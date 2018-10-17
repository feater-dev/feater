import * as _ from 'lodash';
import {InstanceContextPathsInterface} from './instance-context-paths.interface';
import {InstanceContextSourceInterface} from './instance-context-source.interface';
import {InstanceContextVolumeInterface} from './instance-context-volume.interface';
import {InstanceContextServiceInterface} from './instance-context-service.interface';
import {InstanceContextProxiedPortInterface} from './instance-context-proxied-port.interface';
import {InstanceContextAfterBuildTaskInterface} from './after-build/instance-context-after-build-task.interface';
import {InstanceContextComposeFileInterface} from './instance-context-compose-file.interface';
import {EnvVariablesSet} from '../sets/env-variables-set';
import {InstanceContextEnvVariableInterface} from './instance-context-env-variable.interface';
import {InstanceContextSummaryItemInterface} from './instance-context-summary-item.interface';
import {InstanceContextFeaterVariableInterface} from './instance-context-feater-variable.interface';
import {FeaterVariablesSet} from '../sets/feater-variables-set';

export class InstanceContext {

    paths: InstanceContextPathsInterface;
    composeProjectName: string;
    sources: InstanceContextSourceInterface[];
    volumes: InstanceContextVolumeInterface[];
    services: InstanceContextServiceInterface[];
    proxiedPorts: InstanceContextProxiedPortInterface[];
    afterBuildTasks: InstanceContextAfterBuildTaskInterface[];
    composeFiles: InstanceContextComposeFileInterface[]; // TODO
    envVariables: InstanceContextEnvVariableInterface[];
    featerVariables: InstanceContextFeaterVariableInterface[];
    summaryItems: InstanceContextSummaryItemInterface[];

    constructor(
        readonly id: string,
        readonly hash: string,
    ) {
    }

    findSource(sourceId: string): InstanceContextSourceInterface {
        const source = _.find(this.sources, {id: sourceId});
        if (!source) {
            throw new Error();
        }

        return source as InstanceContextSourceInterface;
    }

    findService(serviceId: string): InstanceContextServiceInterface {
        const service = _.find(this.services, {id: serviceId});
        if (!service) {
            throw new Error();
        }

        return service as InstanceContextServiceInterface;
    }

    mergeEnvVariablesSet(envVariablesSet: EnvVariablesSet) {
        this.envVariables = EnvVariablesSet
            .fromList(this.envVariables || [])
            .merge(envVariablesSet)
            .toList();
    }

    mergeFeaterVariablesSet(featerVariablesSet: FeaterVariablesSet) {
        this.featerVariables = FeaterVariablesSet
            .fromList(this.featerVariables || [])
            .merge(featerVariablesSet)
            .toList();
    }

}
