import gql from 'graphql-tag';

export const getInstanceServicesQueryGql = gql`
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
        }
    }
`;

export interface GetInstanceServicesQueryInstanceFieldInterface {
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
}

export interface GetInstanceServicesQueryInterface {
    instance: GetInstanceServicesQueryInstanceFieldInterface;
}
