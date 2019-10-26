import gql from 'graphql-tag';

export const getDefinitionQueryGql = gql`
    query($id: String!) {
        definition(id: $id) {
            id
            name
            actions {
                id
                name
                type
            }
        }
    }
`;

export interface GetDefinitionQueryDefinitionFieldInterface {
    id: string;
    name: string;
    actions: {
        id: string;
        name: string;
        type: string;
    }[];
}

export interface GetDefinitionQueryInterface {
    definition: GetDefinitionQueryDefinitionFieldInterface;
}
