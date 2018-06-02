interface ProjectReference {
    id: string;
    name: string;
}

export interface DefinitionReference {
    id: string;
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
    id: string;
    name: string;
    definition: DefinitionReference;
    summaryItems?: SummaryItem[];
    environmentalVariables: EnvironmentalVariable[];
    proxiedPorts?: {
        [key: string]: ProxiedPort
    };
}
