import gql from 'graphql-tag';


export const getDeployKeyDetailQueryGql = gql`
    query ($id: String!) {
        deployKey(id: $id) {
            id
            cloneUrl
            publicKey
            fingerprint
            createdAt
            updatedAt
        }
    }
`;

export interface GetDeployKeyDetailQueryDeployKeyFieldInterface {
    id: string;
    cloneUrl: string;
    publicKey: string;
    fingerprint: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetDeployKeyDetailQueryInterface {
    deployKey: GetDeployKeyDetailQueryDeployKeyFieldInterface;
}
