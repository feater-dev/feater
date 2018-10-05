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
                definition {
                    id
                    name
                    project {
                        id
                        name
                    }
                }
                createdAt
                updatedAt
            }
            deployKeys {
                id
                sshCloneUrl
                fingerprint
                createdAt
                updatedAt
            }
            createdAt
            updatedAt
        }
    }
`;

export interface GetDefinitionDetailQueryDefinitionFieldInterface {
    readonly id: string;
    readonly project: {
        readonly id: string;
        readonly name: string;
    };
    readonly name: string;
    readonly configAsYaml: string;
    readonly instances: [{
        readonly id: string;
        readonly name: string;
        readonly definition: {
            readonly id: string;
            readonly name: string;
            readonly project: {
                readonly id: string;
                readonly name: string;
            }
        }
        readonly createdAt: string;
        readonly updatedAt: string;
    }];
    readonly deployKeys: [{
        readonly id: string;
        readonly sshCloneUrl: string;
        readonly fingerprint: string;
        readonly updatedAt: string;
    }];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface GetDefinitionDetailQueryInterface {
    readonly definition: GetDefinitionDetailQueryDefinitionFieldInterface;
}
