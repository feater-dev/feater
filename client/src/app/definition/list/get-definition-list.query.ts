import gql from 'graphql-tag';

export const getDefinitionListQueryGql = gql`
    query {
        definitions {
            id
            name
            project {
                id
                name
            }
            instances {
                id
            }
            createdAt
            updatedAt
        }
    }
`;

export interface GetDefinitionListQueryDefinitionsFieldItemInterface {
    id: number;
    name: string;
    project: {
        id: string;
        name: string;
    };
    instances: {
        id: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface GetDefinitionListQueryInterface {
    definitions: GetDefinitionListQueryDefinitionsFieldItemInterface[];
}
