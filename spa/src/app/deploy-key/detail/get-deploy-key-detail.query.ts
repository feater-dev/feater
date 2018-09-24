import gql from 'graphql-tag';


export const getDeployKeyDetailQueryGql = gql`
    query ($id: String!) {
        deployKey(id: $id) {
            id
            sshCloneUrl
            publicKey
            fingerprint
        }
    }
`;

export interface GetDeployKeyDetailQueryDeployKeyFieldInterface {
    readonly id: string;
    readonly sshCloneUrl: string;
    readonly publicKey: string;
    readonly fingerprint: string;
}

export interface GetDeployKeyDetailQueryInterface {
    deployKey: GetDeployKeyDetailQueryDeployKeyFieldInterface;
}
