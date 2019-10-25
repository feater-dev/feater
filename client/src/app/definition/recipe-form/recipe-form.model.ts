export interface RecipeFormElement {
    sources: SourceFormElement[];
    assetVolumes: AssetVolumeFormElement[];
    proxiedPorts: ProxiedPortFormElement[];
    envVariables: EnvVariableFormElement[];
    composeFile: ComposeFileFormElement;
    actions: ActionFormElement[];
    downloadables: DownloadableFormElement[];
    summaryItems: SummaryItemFormElement[];
}

export interface SourceFormElement {
    id: string;
    cloneUrl: string;
    useDeployKey: boolean;
    reference: DefinitionComponentReferenceFormElement;
    beforeBuildTasks: Array<
        | BeforeBuildTaskFormElement
        | TaskFormElement
        | InterpolateTaskFormElement
    >;
}

export interface AssetVolumeFormElement {
    id: string;
    assetId?: string;
}

export interface DefinitionComponentReferenceFormElement {
    type: string;
    name: string;
}

export interface ProxiedPortFormElement {
    serviceId: string;
    id: string;
    name: string;
    port: string;
    useDefaultNginxConfigTemplate: boolean;
    nginxConfigTemplate?: string;
}

export interface EnvVariableFormElement {
    name: string;
    value: string;
}

export interface DownloadableFormElement {
    id: string;
    name: string;
    serviceId: string;
    absolutePath: string;
}

export interface SummaryItemFormElement {
    name: string;
    value: string;
}

export interface ComposeFileFormElement {
    sourceId: string;
    envDirRelativePath: string;
    composeFileRelativePaths: string[];
}

export interface ActionFormElement {
    id: string;
    type: string;
    name: string;
    afterBuildTasks: AfterBuildTaskFormElement[];
}

export interface AfterBuildTaskFormElement {
    type: string;
    id?: string;
    dependsOn?: string[];
}

export interface ExecuteCommandTaskFormElement
    extends AfterBuildTaskFormElement {
    inheritedEnvVariables: {
        name: string;
        alias: string;
    }[];
    customEnvVariables: {
        name: string;
        value: string;
    }[];
    command: string[];
}

export interface ExecuteServiceCommandTaskFormElement
    extends ExecuteCommandTaskFormElement {
    serviceId: string;
}

export interface CopyAssetIntoContainerTaskFormElement
    extends AfterBuildTaskFormElement {
    serviceId: string;
    assetId: string;
    destinationPath: string;
}

export interface BeforeBuildTaskFormElement {
    type: string;
}

export interface TaskFormElement extends BeforeBuildTaskFormElement {
    sourceRelativePath: string;
    destinationRelativePath: string;
}

export interface InterpolateTaskFormElement extends BeforeBuildTaskFormElement {
    relativePath: string;
}
