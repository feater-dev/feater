import gql from 'graphql-tag';

export const getInstanceListQueryGql = gql`
    query($limit: Int, $offset: Int, $definitionId: String) {
        instances(limit: $limit, offset: $offset, definitionId: $definitionId) {
            id
            hash
            name
            createdAt
            updatedAt
            completedAt
            failedAt
            definition {
                id
                name
                project {
                    id
                    name
                }
            }
            services {
                containerState
            }
        }
    }
`;

export interface GetInstanceListQueryInstanceFieldItemInterface {
    id: string;
    hash: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string;
    failedAt: string;
    defintion: {
        id: string;
        name: string;
        project: {
            id: string;
            name: string;
        };
    };
    services: {
        containerState: string;
    }[];
}

export interface GetInstanceListQueryInterface {
    instances: GetInstanceListQueryInstanceFieldItemInterface[];
}
