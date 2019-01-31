import gql from 'graphql-tag';


export const getDeployKeyListQueryGql = gql`
    query {
        deployKeys {
            id
            cloneUrl
            fingerprint
            createdAt
            updatedAt
        }
    }
`;

export interface GetDeployKeyListQueryDeployKeysFieldItemInterface {
    id: string;
    cloneUrl: string;
    fingerprint: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetDeployKeyListQueryInterface {
    deployKeys: GetDeployKeyListQueryDeployKeysFieldItemInterface[];
}
