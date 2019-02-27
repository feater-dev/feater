import gql from 'graphql-tag';


export const getDefinitionConfigurationQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            name
            configAsYaml
        }
    }
`;

export interface GetDefinitionConfigurationQueryDefinitionFieldInterface {
    id: string;
    name: string;
    configAsYaml: string;
}

export interface GetDefinitionConfigurationQueryInterface {
    definition: GetDefinitionConfigurationQueryDefinitionFieldInterface;
}
