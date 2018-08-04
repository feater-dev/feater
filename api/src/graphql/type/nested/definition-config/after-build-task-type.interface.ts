export interface AfterBuildTaskTypeInterface {
    readonly type: string;
    readonly customEnvVariables: [{
        readonly name: string;
        readonly value: string;
    }];
    readonly inheritedEnvVariables: [{
        readonly name: string;
        readonly alias: string;
    }];
    readonly command: [string];
}

export interface ExecuteHostCommandAfterBuildTaskTypeInterface extends AfterBuildTaskTypeInterface {
}

export interface ExecuteServiceCommandAfterBuildTaskTypeInterface extends AfterBuildTaskTypeInterface {
    readonly serviceId: string;
}
