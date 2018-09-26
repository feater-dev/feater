import gql from 'graphql-tag';


export const getDefinitionDetailQueryGql = gql`
    query ($id: String!) {
        definition(id: $id) {
            id
            project {
                id
                name
            }
            name
            configAsYaml
            instances {
                id
                name
            }
            deployKeys {
                id
                sshCloneUrl
                publicKey
                fingerprint
            }
        }
    }
`;

export interface GetDefinitionDetailQueryDefinitionFieldInterface {
    id: string;
    project: {
        id: string;
        name: string;
    };
    name: string;
    configAsYaml: string;
    instances: [
        {
            readonly id: string;
            readonly name: string;
        }
    ];
    deployKeys: [
        {
            readonly id: string;
            readonly sshCloneUrl: string;
            readonly publicKey: string;
            readonly fingerprint: string;
        }
    ];
}

export interface GetDefinitionDetailQueryInterface {
    definition: GetDefinitionDetailQueryDefinitionFieldInterface;
}
