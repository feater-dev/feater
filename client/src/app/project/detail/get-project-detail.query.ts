import gql from 'graphql-tag';


export const getProjectDetailQueryGql = gql`
    query ($id: String!) {
        project(id: $id) {
            id
            name
            definitions {
                id
                name
                project {
                    id
                    name
                }
                instances {
                    id
                }
                createdAt
                updatedAt
            }
            assets {
                id
                description
                project {
                    id
                    name
                }
                createdAt
                updatedAt
            }
            createdAt
            updatedAt
        }
    }
`;

export interface GetProjectDetailQueryProjectFieldInterface {
    id: string;
    name: string;
    definitions: [
        {
            id: string;
            name: string;
            project: {
                id: string;
                name: string;
            }
            instances: [
                {
                    id: string;
                }
            ]
            createdAt: string;
            updatedAt: string;
        }
    ];
    assets: [
        {
            id: string;
            description: string;
            project: {
                id: string;
                name: string;
            }
            createdAt: string;
            updatedAt: string;
        }
    ];
    createdAt: string;
    updatedAt: string;
}

export interface GetProjectDetailQueryInterface {
    project: GetProjectDetailQueryProjectFieldInterface;
}
