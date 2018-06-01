interface ProjectReference {
    _id: string;
    name: string;
}

export interface DefinitionReference {
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

export interface GetInstanceResponseDto {
    _id: string;
    name: string;
    definition: DefinitionReference;
    summaryItems?: SummaryItem[];
    environmentalVariables: EnvironmentalVariable[];
    proxiedPorts?: {
        [key: string]: ProxiedPort
    };
}

export interface AddInstanceResponseDto {
    id: string;
}
