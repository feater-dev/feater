import gql from 'graphql-tag';

export const getInstanceDetailLogsQueryGql = gql`
    query ($id: String!) {
        instance(id: $id) {
            id
            name
            commandLogs {
                description
                createdAt
                completedAt
                failedAt
                entries {
                    message
                }
            }
        }
    }
`;

export interface GetInstanceDetailLogsQueryInstanceFieldinterface {
    readonly id: string;
    readonly name: string;
    readonly commandLogs: [
        {
            readonly description: string;
            readonly createdAt: string;
            readonly completedAt: string;
            readonly failedAt: string;
            readonly entries: [
                {
                    message: string;
                }
            ];
        }
    ];
}

export interface GetInstanceDetailLogsQueryInterface {
    instance: GetInstanceDetailLogsQueryInstanceFieldinterface;
}
