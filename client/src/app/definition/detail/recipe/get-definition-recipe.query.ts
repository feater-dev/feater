import gql from 'graphql-tag';

export const getDefinitionRecipeQueryGql = gql`
    query($id: String!) {
        definition(id: $id) {
            id
            name
            recipeAsYaml
        }
    }
`;

export interface GetDefinitionRecipeQueryDefinitionFieldInterface {
    id: string;
    name: string;
    recipeAsYaml: string;
}

export interface GetDefinitionRecipeQueryInterface {
    definition: GetDefinitionRecipeQueryDefinitionFieldInterface;
}
