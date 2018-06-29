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
            definition {
                id
                name
                project {
                    id
                    name
                }
            }
        }
    }
`;

export interface GetInstanceListQueryInstanceFieldItemInterface {
    readonly id: number;
    readonly name: string;
    readonly createdAt: string;
    readonly defintion: {
        readonly id: string;
        readonly name: string;
        readonly project: {
            readonly id: string;
            readonly name: string;
        };
    };
}

export interface GetInstanceListQueryInterface {
    readonly instances: GetInstanceListQueryInstanceFieldItemInterface[];
}
