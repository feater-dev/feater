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
    summaryItems?: SummaryItem[];
    environmentalVariables: EnvironmentalVariable[];
    exposedPorts?: ExposedPortsByServiceId;
}

type ExposedPortsByServiceId = {
    [key:string]: ExposedPort
}

export interface ExposedPort {
    id: string;
    name: string;
    port: number;
}

type EnvironmentalVariable = {
    key: string;
    value: string;
}

type SummaryItem = {
    name: string;
    value: string;
}

export interface MappedBuildInstance {
    _id: string;
    name: string;
    buildDefinition: BuildDefinitionReference;
    environmentalVariables?: EnvironmentalVariable[];
    summaryItems?: SummaryItem[];
}
