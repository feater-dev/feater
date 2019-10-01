import gql from 'graphql-tag';

export const getProjectQueryGql = gql`
    query($id: String!) {
        project(id: $id) {
            id
            name
        }
    }
`;

export interface GetProjectQueryProjectFieldInterface {
    id: string;
    name: string;
}

export interface GetProjectQueryInterface {
    project: GetProjectQueryProjectFieldInterface;
}
