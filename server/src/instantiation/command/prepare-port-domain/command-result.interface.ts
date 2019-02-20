import {EnvVariablesSet} from '../../sets/env-variables-set';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';

export interface PrepareProxyDomainCommandResultInterface {
    readonly proxyDomain: string;
    readonly envVariables: EnvVariablesSet;
    readonly featerVariables: FeaterVariablesSet;
}
