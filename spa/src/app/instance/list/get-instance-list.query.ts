import gql from 'graphql-tag';


export const getInstanceListQueryGql = gql`
    query (
        $limit: Int
        $offset: Int
        $definitionId: String
    ) {
        instances (
            limit: $limit
            offset: $offset
            definitionId: $definitionId
        ) {
            id
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
    readonly id: number;
    readonly name: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly completedAt: string;
    readonly failedAt: string;
    readonly defintion: {
        readonly id: string;
        readonly name: string;
        readonly project: {
            readonly id: string;
            readonly name: string;
        };
    };
    readonly services: {
        readonly containerState: string;
    }[];
}

export interface GetInstanceListQueryInterface {
    readonly instances: GetInstanceListQueryInstanceFieldItemInterface[];
}
