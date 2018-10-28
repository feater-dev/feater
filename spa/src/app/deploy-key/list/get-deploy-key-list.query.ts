import gql from 'graphql-tag';


export const getDeployKeyListQueryGql = gql`
    query {
        deployKeys {
            id
            cloneUrl
            fingerprint
            updatedAt
        }
    }
`;

export interface GetDeployKeyListQueryDeployKeysFieldItemInterface {
    id: string;
    cloneUrl: string;
    fingerprint: string;
    updatedAt: string;
}

export interface GetDeployKeyListQueryInterface {
    deployKeys: GetDeployKeyListQueryDeployKeysFieldItemInterface[];
}
