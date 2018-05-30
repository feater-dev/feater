interface ProjectReference {
    _id: string;
    name: string;
}

export interface BuildDefinitionReference {
    _id: string;
    name: string;
    project: ProjectReference;
}

interface ProxiedPort {
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
    proxiedPorts?: {
        [key: string]: ProxiedPort
    };
}

export interface AddBuildInstanceResponseDto {
    id: string;
}
