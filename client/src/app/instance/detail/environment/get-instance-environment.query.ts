import gql from 'graphql-tag';

export const getInstanceEnvironmentQueryGql = gql`
    query($id: String!) {
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

export interface GetInstanceEnvironmentQueryInstanceFieldInterface {
    id: string;
    name: string;
    envVariables: {
        name: string;
        value: string;
    }[];
}

export interface GetInstanceEnvironmentQueryInterface {
    instance: GetInstanceEnvironmentQueryInstanceFieldInterface;
}
