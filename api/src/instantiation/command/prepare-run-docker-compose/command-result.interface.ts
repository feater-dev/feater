import {EnvVariablesSet} from '../../sets/env-variables-set';

export interface PrepareRunDockerComposeCommandResultInterface {
    readonly args: string[];
    readonly absoluteGuestEnvDirPath: string;
    readonly envVariables: EnvVariablesSet;
}
