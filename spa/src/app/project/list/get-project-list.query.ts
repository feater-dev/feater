import gql from 'graphql-tag';


export const getProjectListQueryGql = gql`
    query {
        projects {
            id
            name
        }
    }
`;

export interface GetProjectListQueryProjectsFieldItemInterface {
    id: number;
    name: string;
}

export interface GetProjectListQueryInterface {
    projects: GetProjectListQueryProjectsFieldItemInterface[];
}
