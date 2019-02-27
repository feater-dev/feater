import gql from 'graphql-tag';


export const getDefinitionSubstitutionsQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            name
            predictedFeaterVariables {
                name
                value
                pattern
            }
        }
    }
`;

export interface GetDefinitionSubstitutionsQueryDefinitionFieldInterface {
    id: string;
    name: string;
    predictedFeaterVariables: {
        name: string;
        value?: string;
        pattern?: string;
    }[];
}

export interface GetDefinitionSubstitutionsQueryInterface {
    definition: GetDefinitionSubstitutionsQueryDefinitionFieldInterface;
}
