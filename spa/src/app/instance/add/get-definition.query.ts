import gql from 'graphql-tag';


export const getDefinitionQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            name
        }
    }
`;

export interface GetDefinitionQueryDefinitionFieldInterface {
    id: string;
}

export interface GetDefinitionQueryInterface {
    definition: GetDefinitionQueryDefinitionFieldInterface;
}
