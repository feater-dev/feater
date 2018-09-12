import gql from 'graphql-tag';


export const getProjectDetailQueryGql = gql`
    query ($id: String!) {
        project(id: $id) {
            id
            name
            definitions {
                id
                name
            }
            assets {
                id
                description
            }
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
        }
    ];
    readonly assets: [
        {
            readonly id: string;
            readonly description: string;
        }
    ];
}

export interface GetProjectDetailQueryInterface {
    project: GetProjectDetailQueryProjectFieldInterface;
}
