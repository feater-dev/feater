import {RecipeTypeInterface} from './nested/definition-recipe/recipe-type.interface';

export interface DefinitionTypeInterface {
    readonly id: string;
    readonly name: string;
    readonly projectId: string;
    readonly recipeAsYaml: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}
