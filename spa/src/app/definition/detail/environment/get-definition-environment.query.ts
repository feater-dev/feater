import gql from 'graphql-tag';


export const getDefinitionEnvironmentQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            name
            predictedEnvVariables {
                name
                value
                pattern
            }
        }
    }
`;

export interface GetDefinitionEnvironmentQueryDefinitionFieldInterface {
    id: string;
    name: string;
    predictedEnvVariables: {
        name: string;
        value?: string;
        pattern?: string;
    }[];
}

export interface GetDefinitionEnvironmentQueryInterface {
    definition: GetDefinitionEnvironmentQueryDefinitionFieldInterface;
}
