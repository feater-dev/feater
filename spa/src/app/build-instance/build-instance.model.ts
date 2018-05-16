import {BuildDefinitionReference, EnvironmentalVariable, SummaryItem} from './build-instance-response-dtos.model';

export interface MappedBuildInstance {
    _id: string;
    name: string;
    buildDefinition: BuildDefinitionReference;
    environmentalVariables?: EnvironmentalVariable[];
    summaryItems?: SummaryItem[];
}
