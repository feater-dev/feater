import gql from 'graphql-tag';

export const getDefinitionRecipeQueryGql = gql`
    query($id: String!) {
        definition(id: $id) {
            id
            project {
                id
                name
            }
            name
            recipeAsYaml
        }
    }
`;

export interface GetDefinitionRecipeQueryDefinitionFieldInterface {
    id: string;
    project: {
        id: string;
        name: string;
    };
    name: string;
    recipeAsYaml: string;
}

export interface GetDefinitionRecipeQueryInterface {
    definition: GetDefinitionRecipeQueryDefinitionFieldInterface;
}
