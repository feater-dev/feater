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

export interface GetInstanceDetailProxyDomainsQueryInstanceFieldInterface {
    id: string;
    name: string;
    services: [
        {
            id: string;
            containerId: string;
            containerNamePrefix: string;
            ipAddress: string;
            containerState: string;
        }
    ];
    proxiedPorts: [
        {
            id: string;
            serviceId: string;
            name: string;
            port: number;
            domain: string;
        }
    ];
}

export interface GetInstanceDetailProxyDomainsQueryInterface {
    instance: GetInstanceDetailProxyDomainsQueryInstanceFieldInterface;
}
