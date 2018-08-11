export interface DefinitionAddForm {
    name: string;
    config: DefinitionAddFormConfigFormElement;
}

export interface DefinitionAddFormConfigFormElement {
    sources: DefinitionAddFormSourceFormElement[];
    proxiedPorts: DefinitionAddFormProxiedPortFormElement[];
    envVariables: DefinitionAddFormEnvVariableFormElement[];
    composeFile: DefinitionAddComposeFileFormElement;
    afterBuildTasks: DefinitionAddFormAfterBuildTaskFormElement[];
    summaryItems: DefinitionAddFormSummaryItemFormElement[];
}

export interface DefinitionAddFormSourceFormElement {
    id: string;
    sshCloneUrl: string;
    reference: DefinitionAddFormComponentReferenceFormElement;
    beforeBuildTasks: Array<
        DefinitionAddFormBeforeBuildTaskFormElement|
        DefinitionAddFormBeforeBuildCopyTaskFormElement|
        DefinitionAddFormBeforeBuildInterpolateTaskFormElement
    >;
}

export interface DefinitionAddFormComponentReferenceFormElement {
    type: string;
    name: string;
}

export interface DefinitionAddFormProxiedPortFormElement {
    serviceId: string;
    id: string;
    name: string;
    port: number;
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

export interface DefinitionAddFormAfterBuildTaskFormElement {
    type: string;
    inheritedEnvVariables: {
        name: string;
        alias: string;
    }[];
    customEnvVariables: {
        name: string;
        value: string;
    }[];
}

export interface DefinitionAddFormAfterBuildExecuteHostCommandTaskFormElement extends DefinitionAddFormAfterBuildTaskFormElement {
    command: string[];
}

export interface DefinitionAddFormAfterBuildExecuteServiceCommandTaskFormElement extends DefinitionAddFormAfterBuildTaskFormElement {
    serviceId: string;
    command: string[];
}

export interface DefinitionAddFormBeforeBuildTaskFormElement {
    type: string;
}

export interface DefinitionAddFormBeforeBuildCopyTaskFormElement extends DefinitionAddFormBeforeBuildTaskFormElement {
    sourceRelativePath: string;
    destinationRelativePath: string;
}

export interface DefinitionAddFormBeforeBuildInterpolateTaskFormElement extends DefinitionAddFormBeforeBuildTaskFormElement {
    relativePath: string;
}
