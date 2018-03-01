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
    exposedPorts?: ExposedPortsByServiceId;
    summaryItems?: Object[];
}

type ExposedPortsByServiceId = {
    [key:string]: ExposedPort
}

export interface ExposedPort {
    id: string;
    name: string;
    port: number;
}

export interface MappedBuildInstance {
    _id: string;
    name: string;
    buildDefinition: BuildDefinitionReference;
    environmentalVariables?: Object[];
    exposedPorts?: Object[];
    summaryItems?: Object[];
}
