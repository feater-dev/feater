import gql from 'graphql-tag';

export const getProjectListQueryGql = gql`
    query {
        projects {
            id
            name
            createdAt
            updatedAt
        }
    }
`;

export interface GetProjectListQueryProjectsFieldItemInterface {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetProjectListQueryInterface {
    projects: GetProjectListQueryProjectsFieldItemInterface[];
}
