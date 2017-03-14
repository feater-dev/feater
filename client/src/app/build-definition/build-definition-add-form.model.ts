export interface BuildDefinitionAddForm {
    projectId: string;
    name: string;
    config: BuildDefinitionAddFormConfigFormElement;
}

export interface BuildDefinitionAddFormConfigFormElement {
    components: BuildDefinitionAddFormComponentFormElement[];
    externalPorts: BuildDefinitionAddFormExternalPortFormElement[];
    environmentalVariables: BuildDefinitionAddFormEnvironmentalVariableFormElement[];
    composeFile: BuildDefinitionAddComposeFileFormElement;
    summaryItems: BuildDefinitionAddFormSummaryItemFormElement[];
}

export interface BuildDefinitionAddFormComponentFormElement {
    id: string;
    source: BuildDefinitionAddFormComponentSourceFormElement;
    reference: BuildDefinitionAddFormComponentReferenceFormElement;
    beforeBuildTasks: Array<
        BuildDefinitionAddFormBeforeBuildTaskFormElement|
        BuildDefinitionAddFormBeforeBuildCopyTaskFormElement|
        BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement
    >;
}

export interface BuildDefinitionAddFormComponentSourceFormElement {
    type: string;
    name: string;
}

export interface BuildDefinitionAddFormComponentReferenceFormElement {
    type: string;
    name: string;
}

export interface BuildDefinitionAddFormExternalPortFormElement {
    id: string;
    rangeStart: number;
    rangeEnd: number;
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
    componentId: string;
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
