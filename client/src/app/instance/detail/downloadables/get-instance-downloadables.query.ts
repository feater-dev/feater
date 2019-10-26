import gql from 'graphql-tag';

export const getInstanceDownloadablesQueryGql = gql`
    query($id: String!) {
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
            downloadables {
                id
                name
                serviceId
                absolutePath
            }
        }
    }
`;

export interface GetInstanceDownloadablesQueryInstanceFieldInterface {
    id: string;
    name: string;
    services: {
        id: string;
        containerId: string;
        containerNamePrefix: string;
        ipAddress: string;
        containerState: string;
    }[];
    downloadables: {
        id: string;
        name: string;
        serviceId: string;
        absolutePath: string;
    }[];
}

export interface GetInstanceDownloadablesQueryInterface {
    instance: GetInstanceDownloadablesQueryInstanceFieldInterface;
}
