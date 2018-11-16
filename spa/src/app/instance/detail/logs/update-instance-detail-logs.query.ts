import gql from 'graphql-tag';

export const updateInstanceDetailLogsQueryGql = gql`
    query ($id: String!, $lastCommandLogEntryId: String) {
        instance(id: $id) {
            id
            commandLogs {
                id
                description
                createdAt
                completedAt
                failedAt
                entries(afterId: $lastCommandLogEntryId) {
                    id
                    message
                }
            }
        }
    }
`;

export interface UpdateInstanceDetailLogsQueryInstanceFieldInterface {
    readonly id: string;
    readonly commandLogs: {
        readonly id: string;
        readonly description: string;
        readonly createdAt: string;
        completedAt: string;
        failedAt: string;
        readonly entries: {
            readonly id: string;
            readonly message: string;
            readonly timestamp: string;
            formattedTimestamp: string;
        }[];
    }[];
}

export interface UpdateInstanceDetailLogsQueryInterface {
    instance: UpdateInstanceDetailLogsQueryInstanceFieldInterface;
}
