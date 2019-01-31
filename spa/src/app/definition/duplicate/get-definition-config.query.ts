import gql from 'graphql-tag';


export const getDefinitionConfigQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            project {
                id
                name
            }
            name
            configAsYaml
        }
    }
`;

export interface GetDefinitionConfigQueryDefinitionFieldInterface {
    id: string;
    project: {
        id: string;
        name: string;
    };
    name: string;
    configAsYaml: string;
}

export interface GetDefinitionConfigQueryInterface {
    definition: GetDefinitionConfigQueryDefinitionFieldInterface;
}
