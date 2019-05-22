// export interface DefinitionDuplicateForm {
//     name: string;
//     config: DefinitionConfigFormElement;
// }

// export interface DefinitionEditForm {
//     id: string;
//     name: string;
//     config: DefinitionConfigFormElement;
// }

export interface DefinitionConfigFormElement {
    sources: DefinitionSourceFormElement[];
    volumes: DefinitionVolumeFormElement[];
    proxiedPorts: DefinitionProxiedPortFormElement[];
    envVariables: DefinitionEnvVariableFormElement[];
    composeFile: DefinitionAddComposeFileFormElement;
    afterBuildTasks: AfterBuildTaskFormElement[];
    summaryItems: DefinitionSummaryItemFormElement[];
}

export interface DefinitionSourceFormElement {
    id: string;
    cloneUrl: string;
    useDeployKey: boolean;
    reference: DefinitionComponentReferenceFormElement;
    beforeBuildTasks: Array<
        BeforeBuildTaskFormElement|
        TaskFormElement|
        InterpolateTaskFormElement
    >;
}

export interface DefinitionVolumeFormElement {
    id: string;
    assetId?: string;
}

export interface DefinitionComponentReferenceFormElement {
    type: string;
    name: string;
}

export interface DefinitionProxiedPortFormElement {
    serviceId: string;
    id: string;
    name: string;
    port: string;
}

export interface DefinitionEnvVariableFormElement {
    name: string;
    value: string;
}

export interface DefinitionSummaryItemFormElement {
    name: string;
    value: string;
}

export interface DefinitionAddComposeFileFormElement {
    sourceId: string;
    envDirRelativePath: string;
    composeFileRelativePaths: string[];
}

export interface AfterBuildTaskFormElement {
    type: string;
    id?: string;
    dependsOn?: string[];
}

export interface ExecuteCommandTaskFormElement extends AfterBuildTaskFormElement {
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

export interface ExecuteServiceCommandTaskFormElement extends ExecuteCommandTaskFormElement {
    serviceId: string;
}

export interface CopyAssetIntoContainerTaskFormElement extends AfterBuildTaskFormElement {
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
