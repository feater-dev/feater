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
    id: string;
    name: string;
    commandLogs: {
        id: string;
        description: string;
        createdAt: string;
        completedAt: string;
        failedAt: string;
        entries: {
            id: string;
            timestamp: string;
            formattedTimestamp: string;
            message: string;
        }[];
    }[];
}

export interface GetInstanceDetailLogsQueryInterface {
    instance: GetInstanceDetailLogsQueryInstanceFieldInterface;
}
