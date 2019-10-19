// Asset volumes.

export interface AssetVolumeInterface {
    id: string;
    assetId?: string;
}

// Before build tasks.

export interface BeforeBuildTaskInterface {
    readonly type: string;
}

export interface CopyBeforeBuildTaskInterface extends BeforeBuildTaskInterface {
    readonly sourceRelativePath: string;
    readonly destinationRelativePath: string;
}

export interface InterpolateBeforeBuildTaskInterface
    extends BeforeBuildTaskInterface {
    readonly relativePath: string;
}

export type BeforeBuildTask =
    | CopyBeforeBuildTaskInterface
    | InterpolateBeforeBuildTaskInterface;

// Source.

export interface SourceReferenceInterface {
    readonly type: string;
    readonly name: string;
}

export interface SourceInterface {
    readonly id: string;
    readonly cloneUrl: string;
    readonly useDeployKey: boolean;
    readonly reference: SourceReferenceInterface;
    readonly beforeBuildTasks: BeforeBuildTask[];
}

// Env variables.

export interface EnvVariableInterface {
    readonly name: string;
    readonly value: string;
}

// Proxied port.

export interface ProxiedPortInterface {
    readonly id: string;
    readonly serviceId: string;
    readonly port: number;
    readonly name: string;
    readonly nginxConfigTemplate?: string;
}

// Compose file.

export interface ComposeFileInterface {
    readonly sourceId: string;
    readonly envDirRelativePath: string;
    readonly composeFileRelativePaths: string[];
}

// After build tasks.

export interface AfterBuildTaskInterface {
    type: string;
    id?: string;
    dependsOn?: string[];
}

interface ExecuteCommandAfterBuildTaskInterface
    extends AfterBuildTaskInterface {
    customEnvVariables: {
        name: string;
        value: string;
    }[];
    inheritedEnvVariables: {
        name: string;
        alias: string;
    }[];
    command: string[];
}

export interface ExecuteServiceCommandAfterBuildTaskInterface
    extends ExecuteCommandAfterBuildTaskInterface {
    serviceId: string;
}

export interface CopyAssetIntoContainerAfterBuildTaskInterface
    extends AfterBuildTaskInterface {
    serviceId: string;
    assetId: string;
    destinationPath: string;
}

export type AfterBuildTask =
    | ExecuteServiceCommandAfterBuildTaskInterface
    | CopyAssetIntoContainerAfterBuildTaskInterface;

// Actions.

export interface ActionInterface {
    readonly type: string;
    readonly id: string;
    readonly name: string;
    readonly afterBuildTasks: AfterBuildTask[];
}

// Downloadables.

export interface DownloadableInterface {
    // TODO Forward port. Add missing properties.
}

// Summary items.

export interface SummaryItemInterface {
    readonly name: string;
    readonly value: string;
}

// Recipe.

export interface RecipeInterface {
    readonly assetVolumes: AssetVolumeInterface[];
    readonly sources: SourceInterface[];
    readonly envVariables: EnvVariableInterface[];
    readonly proxiedPorts: ProxiedPortInterface[];
    readonly composeFiles: ComposeFileInterface[];
    readonly actions: ActionInterface[];
    readonly downloadables: DownloadableInterface[];
    readonly summaryItems: SummaryItemInterface[];
}
