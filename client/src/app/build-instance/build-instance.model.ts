export interface ProjectReference {
    _id: string;
    name: string;
}

export interface BuildDefinitionReference {
    _id: string;
    name: string;
    project: ProjectReference;
}

export interface BuildInstance {
    _id: string;
    name: string;
    buildDefinition: BuildDefinitionReference;
    environmentalVariables?: Object;
    externalPorts?: Object;
    summaryItems?: Object[];
}

export interface MappedBuildInstance {
    _id: string;
    name: string;
    buildDefinition: BuildDefinitionReference;
    environmentalVariables?: Object[];
    externalPorts?: Object[];
    summaryItems?: Object[];
}
