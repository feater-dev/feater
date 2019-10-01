import gql from 'graphql-tag';

export const getAssetDetailQueryGql = gql`
    query($id: String!, $projectId: String!) {
        asset(projectId: $projectId, id: $id) {
            id
            project {
                id
                name
            }
            description
            createdAt
            updatedAt
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
    createdAt: string;
    updatedAt: string;
}

export interface GetAssetDetailQueryInterface {
    asset: GetAssetDetailQueryAssetFieldInterface;
}
