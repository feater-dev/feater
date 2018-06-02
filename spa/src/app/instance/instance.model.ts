import {DefinitionReference, EnvironmentalVariable, SummaryItem} from './instance-response-dtos.model';

export interface MappedInstance {
    id: string;
    name: string;
    definition: DefinitionReference;
    environmentalVariables?: EnvironmentalVariable[];
    summaryItems?: SummaryItem[];
}
