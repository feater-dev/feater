import gql from 'graphql-tag';


export const getProjectQueryGql = gql`
    query ($id: String!) {
        project(id: $id) {
            id
            name
        }
    }
`;

export interface GetProjectQueryProjectFieldInterface {
    readonly id: string;
    readonly name: string;
}

export interface GetProjectQueryInterface {
    readonly project: GetProjectQueryProjectFieldInterface;
}
