export interface AfterBuildTaskTypeInterface {
    readonly type: string;
}

interface ExecuteCommandAfterBuildTaskTypeInterface extends AfterBuildTaskTypeInterface {
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

export interface ExecuteHostCommandAfterBuildTaskTypeInterface extends ExecuteCommandAfterBuildTaskTypeInterface {
}

export interface ExecuteServiceCommandAfterBuildTaskTypeInterface extends ExecuteCommandAfterBuildTaskTypeInterface {
    readonly serviceId: string;
}

export interface CopyAssetIntoContainerAfterBuildTaskTypeInterface extends AfterBuildTaskTypeInterface {
    readonly serviceId: string;
    readonly assetId: string;
    readonly destinationPath: string;
}
