import { DefinitionActionTypeInterface } from './definition-action-type.interface';

export interface DefinitionTypeInterface {
    readonly id: string;
    readonly name: string;
    readonly projectId: string;
    readonly recipeAsYaml: string;
    readonly actions: DefinitionActionTypeInterface[];
    readonly createdAt: string;
    readonly updatedAt: string;
}
