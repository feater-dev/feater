import gql from 'graphql-tag';

export const getInstanceDetailServicesQueryGql = gql`
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

export interface GetInstanceDetailServicesQueryInstanceFieldinterface {
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
}

export interface GetInstanceDetailServicesQueryInterface {
    instance: GetInstanceDetailServicesQueryInstanceFieldinterface;
}
