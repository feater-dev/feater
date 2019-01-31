import gql from 'graphql-tag';


export const getAssetListQueryGql = gql`
    query {
        assets {
            id
            createdAt
            updatedAt
        }
    }
`;

export interface GetAssetListQueryAssetsFieldItemInterface {
    id: number;
    createdAt: string;
    updatedAt: string;
}

export interface GetAssetListQueryInterface {
    assets: GetAssetListQueryAssetsFieldItemInterface[];
}
