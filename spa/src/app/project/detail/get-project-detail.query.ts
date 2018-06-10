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
}

export interface GetProjectDetailQueryInterface {
    project: GetProjectDetailQueryProjectFieldInterface;
}
