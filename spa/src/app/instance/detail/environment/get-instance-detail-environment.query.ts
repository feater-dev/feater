import gql from 'graphql-tag';

export const getInstanceDetailEnvironmentQueryGql = gql`
    query ($id: String!) {
        instance(id: $id) {
            id
            name
            envVariables {
                name
                value
            }
        }
    }
`;

export interface GetInstanceDetailEnvironmentQueryInstanceFieldInterface {
    id: string;
    name: string;
    envVariables: [
        {
            name: string;
            value: string;
        }
    ];
}

export interface GetInstanceDetailEnvironmentQueryInterface {
    instance: GetInstanceDetailEnvironmentQueryInstanceFieldInterface;
}
