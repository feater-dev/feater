import gql from 'graphql-tag';


export const getAssetDetailQueryGql = gql`
    query ($id: String!) {
        asset(id: $id) {
            id
            project {
                id
                name
            }
            description
        }
    }
`;

export interface GetAssetDetailQueryAssetFieldInterface {
    id: string;
    description: string;
    project: {
        id: string;
        name: string;
    };
}

export interface GetAssetDetailQueryInterface {
    asset: GetAssetDetailQueryAssetFieldInterface;
}
