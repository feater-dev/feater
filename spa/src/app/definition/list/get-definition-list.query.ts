import gql from 'graphql-tag';


export const getDefinitionListQueryGql = gql`
    query {
        definitions {
            id
            name
        }
    }
`;

export interface GetDefinitionListQueryDefinitionsFieldItemInterface {
    id: number;
    name: string;
}

export interface GetDefinitionListQueryInterface {
    definitions: GetDefinitionListQueryDefinitionsFieldItemInterface[];
}
