import gql from 'graphql-tag';


export const getAssetListQueryGql = gql`
    query {
        assets {
            id
            name
        }
    }
`;

export interface GetAssetListQueryAssetsFieldItemInterface {
    id: number;
    name: string;
}

export interface GetAssetListQueryInterface {
    assets: GetAssetListQueryAssetsFieldItemInterface[];
}
