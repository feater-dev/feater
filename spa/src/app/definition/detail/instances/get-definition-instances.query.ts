import gql from 'graphql-tag';


export const getDefinitionInstancesQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            name
            instances {
                id
                hash
                name
                definition {
                    id
                    name
                    project {
                        id
                        name
                    }
                }
                createdAt
                updatedAt
                completedAt
                failedAt
                services {
                    containerState
                }
            }
        }
    }
`;

export interface GetDefinitionInstancesQueryDefinitionFieldInterface {
    id: string;
    name: string;
    instances: {
        id: string;
        hash: string;
        name: string;
        definition: {
            id: string;
            name: string;
            project: {
                id: string;
                name: string;
            }
        }
        createdAt: string;
        updatedAt: string;
        completedAt: string;
        faliedAt: string;
        services: {
            containerState: string;
        }[];
    }[];
}

export interface GetDefinitionInstancesQueryInterface {
    definition: GetDefinitionInstancesQueryDefinitionFieldInterface;
}
