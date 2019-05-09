export interface DefinitionAddForm {
    name: string;
    config: DefinitionAddFormConfigFormElement;
}

export interface DefinitionEditForm extends DefinitionAddForm {
    id: string;
}

export interface DefinitionAddFormConfigFormElement {
    sources: DefinitionAddFormSourceFormElement[];
    volumes: DefinitionAddFormVolumeFormElement[];
    proxiedPorts: DefinitionAddFormProxiedPortFormElement[];
    envVariables: DefinitionAddFormEnvVariableFormElement[];
    composeFile: DefinitionAddComposeFileFormElement;
    afterBuildTasks: AfterBuildTaskFormElement[];
    summaryItems: DefinitionAddFormSummaryItemFormElement[];
}

export interface DefinitionAddFormSourceFormElement {
    id: string;
    cloneUrl: string;
    reference: DefinitionAddFormComponentReferenceFormElement;
    beforeBuildTasks: Array<
        BeforeBuildTaskFormElement|
        TaskFormElement|
        InterpolateTaskFormElement
    >;
}

export interface DefinitionAddFormVolumeFormElement {
    id: string;
    assetId?: string;
}

export interface DefinitionAddFormComponentReferenceFormElement {
    type: string;
    name: string;
}

export interface DefinitionAddFormProxiedPortFormElement {
    serviceId: string;
    id: string;
    name: string;
    port: string;
}

export interface DefinitionAddFormEnvVariableFormElement {
    name: string;
    value: string;
}

export interface DefinitionAddFormSummaryItemFormElement {
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
