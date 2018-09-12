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
    readonly id: string;
    readonly description: string;
    readonly project: {
        readonly id: string;
        readonly name: string;
    };
}

export interface GetAssetDetailQueryInterface {
    asset: GetAssetDetailQueryAssetFieldInterface;
}
