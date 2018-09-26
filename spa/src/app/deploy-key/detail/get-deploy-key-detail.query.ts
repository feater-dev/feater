import gql from 'graphql-tag';


export const getDeployKeyDetailQueryGql = gql`
    query ($id: String!) {
        deployKey(id: $id) {
            id
            sshCloneUrl
            publicKey
            fingerprint
            createdAt
            updatedAt
        }
    }
`;

export interface GetDeployKeyDetailQueryDeployKeyFieldInterface {
    readonly id: string;
    readonly sshCloneUrl: string;
    readonly publicKey: string;
    readonly fingerprint: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface GetDeployKeyDetailQueryInterface {
    deployKey: GetDeployKeyDetailQueryDeployKeyFieldInterface;
}
