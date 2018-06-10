import gql from 'graphql-tag';


export const getInstanceListQueryGql = gql`
    query {
        instances {
            id
            name
        }
    }
`;

export interface GetInstanceListQueryInstanceFieldItemInterface {
    id: number;
    name: string;
}

export interface GetInstanceListQueryInterface {
    instances: GetInstanceListQueryInstanceFieldItemInterface[];
}
