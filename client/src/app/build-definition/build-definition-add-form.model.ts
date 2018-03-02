export interface BuildDefinitionAddForm {
    projectId: string;
    name: string;
    config: BuildDefinitionAddFormConfigFormElement;
}

export interface BuildDefinitionAddFormConfigFormElement {
    sources: BuildDefinitionAddFormSourceFormElement[];
    exposedPorts: BuildDefinitionAddFormExposedPortFormElement[];
    environmentalVariables: BuildDefinitionAddFormEnvironmentalVariableFormElement[];
    composeFile: BuildDefinitionAddComposeFileFormElement;
    summaryItems: BuildDefinitionAddFormSummaryItemFormElement[];
}

export interface BuildDefinitionAddFormSourceFormElement {
    id: string;
    type: string;
    name: string;
    reference: BuildDefinitionAddFormComponentReferenceFormElement;
    beforeBuildTasks: Array<
        BuildDefinitionAddFormBeforeBuildTaskFormElement|
        BuildDefinitionAddFormBeforeBuildCopyTaskFormElement|
        BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement
    >;
}

export interface BuildDefinitionAddFormComponentReferenceFormElement {
    type: string;
    name: string;
}

export interface BuildDefinitionAddFormExposedPortFormElement {
    serviceId: string;
    id: string;
    name: string;
    port: number;
}

export interface BuildDefinitionAddFormEnvironmentalVariableFormElement {
    name: string;
    value: string;
}

export interface BuildDefinitionAddFormSummaryItemFormElement {
    name: string;
    value: string;
}

export interface BuildDefinitionAddComposeFileFormElement {
    sourceId: string;
    relativePath: string;
}

export interface BuildDefinitionAddFormBeforeBuildTaskFormElement {
    type: string;
}

export interface BuildDefinitionAddFormBeforeBuildCopyTaskFormElement extends BuildDefinitionAddFormBeforeBuildTaskFormElement {
    sourceRelativePath: string;
    destinationRelativePath: string;
}

export interface BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement extends BuildDefinitionAddFormBeforeBuildTaskFormElement {
    relativePath: string;
}
