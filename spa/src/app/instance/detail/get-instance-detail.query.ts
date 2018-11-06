import gql from 'graphql-tag';

export const getInstanceDetailQueryGql = gql`
    query ($id: String!) {
        instance(id: $id) {
            id
            name
            definition {
                id
                name
                project {
                    id
                    name
                }
            }
            services {
                id
                containerId
                containerNamePrefix
                containerState
                ipAddress
            }
            proxiedPorts {
                serviceId
                id
                name
                port
                domain
            }
            summaryItems {
                name
                value
            }
            envVariables {
                name
                value
            }
            createdAt
            updatedAt
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

export interface GetInstanceDetailQueryInstanceFieldinterface {
    readonly id: string;
    readonly definition: {
        readonly id: string;
        readonly name: string;
        readonly project: {
            readonly id: string;
            readonly name: string;
        };
    };
    readonly hash: string;
    readonly name: string;
    readonly services: [
        {
            readonly id: string;
            readonly containerId: string;
            readonly containerNamePrefix: string;
            readonly ipAddress: string;
            readonly containerState: string;
        }
    ];
    readonly summaryItems: [
        {
            readonly name: string;
            readonly value: string;
        }
    ];
    readonly envVariables: [
        {
            readonly name: string;
            readonly value: string;
        }
    ];
    readonly proxiedPorts: [
        {
            readonly id: string;
            readonly serviceId: string;
            readonly name: string;
            readonly port: number;
            readonly domain: string;
        }
    ];
    readonly createdAt: string;
    readonly updatedAt: string;
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

export interface GetInstanceDetailQueryInterface {
    instance: GetInstanceDetailQueryInstanceFieldinterface;
}
