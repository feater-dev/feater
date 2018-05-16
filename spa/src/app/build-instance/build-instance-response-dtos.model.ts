interface ProjectReference {
    _id: string;
    name: string;
}

export interface BuildDefinitionReference {
    _id: string;
    name: string;
    project: ProjectReference;
}

interface ExposedPort {
    id: string;
    name: string;
    port: number;
}

export interface EnvironmentalVariable {
    key: string;
    value: string;
}

export interface SummaryItem {
    name: string;
    value: string;
}

export interface GetBuildInstanceResponseDto {
    _id: string;
    name: string;
    buildDefinition: BuildDefinitionReference;
    summaryItems?: SummaryItem[];
    environmentalVariables: EnvironmentalVariable[];
    exposedPorts?: {
        [key: string]: ExposedPort
    };
}

export interface AddBuildInstanceResponseDto {
    id: string;
}
