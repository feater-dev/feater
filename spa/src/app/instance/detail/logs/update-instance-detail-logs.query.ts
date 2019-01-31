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
    id: string;
    commandLogs: {
        id: string;
        description: string;
        createdAt: string;
        completedAt: string;
        failedAt: string;
        entries: {
            id: string;
            message: string;
            timestamp: string;
            formattedTimestamp: string;
        }[];
    }[];
}

export interface UpdateInstanceDetailLogsQueryInterface {
    instance: UpdateInstanceDetailLogsQueryInstanceFieldInterface;
}
