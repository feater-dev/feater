import gql from 'graphql-tag';

export const getInstanceDetailLogsQueryGql = gql`
    query ($id: String!) {
        instance(id: $id) {
            id
            name
            commandLogs {
                id
                description
                createdAt
                completedAt
                failedAt
                entries {
                    id
                    timestamp
                    message
                }
            }
        }
    }
`;

export interface GetInstanceDetailLogsQueryInstanceFieldInterface {
    readonly id: string;
    readonly name: string;
    readonly commandLogs: {
        readonly id: string;
        readonly description: string;
        readonly createdAt: string;
        completedAt: string;
        failedAt: string;
        readonly entries: {
            readonly id: string;
            readonly timestamp: string;
            formattedTimestamp: string;
            readonly message: string;
        }[];
    }[];
}

export interface GetInstanceDetailLogsQueryInterface {
    instance: GetInstanceDetailLogsQueryInstanceFieldInterface;
}
