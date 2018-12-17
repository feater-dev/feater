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
    readonly id: string;
    readonly name: string;
    readonly envVariables: [
        {
            readonly name: string;
            readonly value: string;
        }
    ];
}

export interface GetInstanceDetailEnvironmentQueryInterface {
    instance: GetInstanceDetailEnvironmentQueryInstanceFieldInterface;
}
