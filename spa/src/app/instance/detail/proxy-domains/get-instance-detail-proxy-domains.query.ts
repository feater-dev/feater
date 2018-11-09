import gql from 'graphql-tag';

export const getInstanceDetailProxyDomainsQueryGql = gql`
    query ($id: String!) {
        instance(id: $id) {
            id
            name
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
        }
    }
`;

export interface GetInstanceDetailProxyDomainsQueryInstanceFieldinterface {
    readonly id: string;
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
    readonly proxiedPorts: [
        {
            readonly id: string;
            readonly serviceId: string;
            readonly name: string;
            readonly port: number;
            readonly domain: string;
        }
    ];
}

export interface GetInstanceDetailProxyDomainsQueryInterface {
    instance: GetInstanceDetailProxyDomainsQueryInstanceFieldinterface;
}
