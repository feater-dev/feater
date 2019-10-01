import gql from 'graphql-tag';

export const getAssetListQueryGql = gql`
    query {
        assets {
            id
            createdAt
            updatedAt
            project {
                id
                name
            }
        }
    }
`;

export interface GetAssetListQueryAssetsFieldItemInterface {
    id: string;
    createdAt: string;
    updatedAt: string;
    project: {
        id: string;
        name: string;
    };
}

export interface GetAssetListQueryInterface {
    assets: GetAssetListQueryAssetsFieldItemInterface[];
}
