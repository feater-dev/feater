export interface DefinitionAddForm {
    projectId: string;
    name: string;
    config: DefinitionAddFormConfigFormElement;
}

export interface DefinitionAddFormConfigFormElement {
    sources: DefinitionAddFormSourceFormElement[];
    proxiedPorts: DefinitionAddFormProxiedPortFormElement[];
    environmentalVariables: DefinitionAddFormEnvironmentalVariableFormElement[];
    composeFile: DefinitionAddComposeFileFormElement;
    summaryItems: DefinitionAddFormSummaryItemFormElement[];
}

export interface DefinitionAddFormSourceFormElement {
    id: string;
    type: string;
    name: string;
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

export interface DefinitionAddFormEnvironmentalVariableFormElement {
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
