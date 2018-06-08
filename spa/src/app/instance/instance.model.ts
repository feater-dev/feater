import {DefinitionReference, EnvVariable, SummaryItem} from './instance-response-dtos.model';

export interface MappedInstance {
    id: string;
    name: string;
    definition: DefinitionReference;
    envVariables?: EnvVariable[];
    summaryItems?: SummaryItem[];
}
