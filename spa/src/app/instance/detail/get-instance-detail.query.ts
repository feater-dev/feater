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
                cleanId
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
                proxyDomain
            }
            summaryItems {
                name
                text
            }
            envVariables {
                name
                value
            }
            createdAt
            logs {
                createdAt
                message
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
            readonly cleanId: string;
            readonly containerId: string;
            readonly containerNamePrefix: string;
            readonly ipAddress: string;
            readonly containerState: string;
        }
    ];
    readonly summaryItems: [
        {
            readonly name: string;
            readonly text: string;
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
            readonly proxyDomain: string;
        }
    ];
    readonly createdAt: string,
    readonly logs: [
        {
            readonly createdAt: string;
            readonly message: string;
        }
    ];
}

export interface GetInstanceDetailQueryInterface {
    instance: GetInstanceDetailQueryInstanceFieldinterface;
}
