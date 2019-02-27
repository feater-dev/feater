import gql from 'graphql-tag';


export const getDefinitionSummaryQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            name
            createdAt
            updatedAt
            project {
                id
                name
            }
            instances {
                id
            }
        }
    }
`;

export interface GetDefinitionSummaryQueryDefinitionFieldInterface {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    project: {
        id: string;
        name: string;
    };
    instances: {
        name: string;
    }[];
}

export interface GetDefinitionSummaryQueryInterface {
    definition: GetDefinitionSummaryQueryDefinitionFieldInterface;
}
