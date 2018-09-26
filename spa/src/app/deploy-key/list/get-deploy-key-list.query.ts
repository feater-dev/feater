import gql from 'graphql-tag';


export const getDeployKeyListQueryGql = gql`
    query {
        deployKeys {
            id
            sshCloneUrl
            fingerprint
            updatedAt
        }
    }
`;

export interface GetDeployKeyListQueryDeployKeysFieldItemInterface {
    id: string;
    sshCloneUrl: string;
    fingerprint: string;
    updatedAt: string;
}

export interface GetDeployKeyListQueryInterface {
    deployKeys: GetDeployKeyListQueryDeployKeysFieldItemInterface[];
}
