import gql from 'graphql-tag';


export const getDefinitionConfigQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            project {
                id
                name
            }
            name
            configAsYaml
        }
    }
`;

export interface GetDefinitionConfigQueryDefinitionFieldInterface {
    readonly id: string;
    readonly project: {
        readonly id: string;
        readonly name: string;
    };
    readonly name: string;
    readonly configAsYaml: string;
}

export interface GetDefinitionConfigQueryInterface {
    readonly definition: GetDefinitionConfigQueryDefinitionFieldInterface;
}
