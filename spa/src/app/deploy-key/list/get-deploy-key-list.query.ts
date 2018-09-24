import gql from 'graphql-tag';


export const getDeployKeyListQueryGql = gql`
    query {
        deployKeys {
            id
            sshCloneUrl
            fingerprint
        }
    }
`;

export interface GetDeployKeyListQueryDeployKeysFieldItemInterface {
    id: string;
    sshCloneUrl: string;
    fingerprint: string;
}

export interface GetDeployKeyListQueryInterface {
    deployKeys: GetDeployKeyListQueryDeployKeysFieldItemInterface[];
}
