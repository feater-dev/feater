import gql from 'graphql-tag';

export const getInstanceLogsQueryGql = gql`
    query($id: String!) {
        instance(id: $id) {
            id
            name
            actionLogs {
                id
                actionId
                actionType
                actionName
                createdAt
                completedAt
                failedAt
                commandLogs {
                    id
                    description
                    createdAt
                    completedAt
                    failedAt
                    entries {
                        level
                        message
                    }
                }
            }
            definition {
                actions {
                    id
                    name
                    type
                }
            }
        }
    }
`;

export interface GetInstanceLogsQueryInstanceFieldInterface {
    id: string;
    name: string;
    actionLogs: {
        id: string;
        actionId: string;
        actionType: string;
        actionName: string;
        createdAt: string;
        completedAt: string;
        failedAt: string;
        commandLogs: {
            id: string;
            description: string;
            createdAt: string;
            completedAt: string;
            failedAt: string;
            entries: {
                level: string;
                message: string;
            }[];
        }[];
    }[];
    definition: {
        actions: {
            id: string;
            name: string;
            type: string;
        }[];
    };
}

export interface GetInstanceLogsQueryInterface {
    instance: GetInstanceLogsQueryInstanceFieldInterface;
}
