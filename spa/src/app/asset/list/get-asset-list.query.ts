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
    readonly id: number;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface GetAssetListQueryInterface {
    readonly assets: GetAssetListQueryAssetsFieldItemInterface[];
}
