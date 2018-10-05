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
            }
            assets {
                id
                description
                project {
                    id
                    name
                }
            }
            createdAt
            updatedAt
        }
    }
`;

export interface GetProjectDetailQueryProjectFieldInterface {
    readonly id: string;
    readonly name: string;
    readonly definitions: [
        {
            readonly id: string;
            readonly name: string;
            readonly project: {
                readonly id: string;
                readonly name: string;
            }
            readonly instances: [
                {
                    readonly id: string;
                }
            ]
        }
    ];
    readonly assets: [
        {
            readonly id: string;
            readonly description: string;
            readonly project: {
                readonly id: string;
                readonly name: string;
            }
        }
    ];
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface GetProjectDetailQueryInterface {
    project: GetProjectDetailQueryProjectFieldInterface;
}
