import gql from 'graphql-tag';


export const getDefinitionDeployKeysQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            name
            deployKeys {
                id
                cloneUrl
                fingerprint
                createdAt
                updatedAt
            }
        }
    }
`;

export interface GetDefinitionDeployKeysQueryDefinitionFieldInterface {
    id: string;
    name: string;
    deployKeys: {
        id: string;
        cloneUrl: string;
        fingerprint: string;
        updatedAt: string;
    }[];
}

export interface GetDefinitionDeployKeysQueryInterface {
    definition: GetDefinitionDeployKeysQueryDefinitionFieldInterface;
}
