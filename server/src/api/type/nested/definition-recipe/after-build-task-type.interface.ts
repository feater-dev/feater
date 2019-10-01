export interface AfterBuildTaskTypeInterface {
    type: string;
    id?: string;
    dependsOn?: string[];
}

interface ExecuteCommandAfterBuildTaskTypeInterface
    extends AfterBuildTaskTypeInterface {
    customEnvVariables: [
        {
            name: string;
            value: string;
        },
    ];
    inheritedEnvVariables: [
        {
            name: string;
            alias: string;
        },
    ];
    command: string[];
}

export interface ExecuteServiceCommandAfterBuildTaskTypeInterface
    extends ExecuteCommandAfterBuildTaskTypeInterface {
    serviceId: string;
}

export interface CopyAssetIntoContainerAfterBuildTaskTypeInterface
    extends AfterBuildTaskTypeInterface {
    serviceId: string;
    assetId: string;
    destinationPath: string;
}
