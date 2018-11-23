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
                hash
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
                completedAt
                failedAt
                services {
                    containerState
                }
            }
            deployKeys {
                id
                cloneUrl
                fingerprint
                createdAt
                updatedAt
            }
            predictedEnvVariables {
                name
                value
                pattern
            }
            predictedFeaterVariables {
                name
                value
                pattern
            }
            createdAt
            updatedAt
        }
    }
`;

export interface GetDefinitionDetailQueryDefinitionFieldInterface {
    readonly id: string;
    readonly hash: string;
    readonly project: {
        readonly id: string;
        readonly name: string;
    };
    readonly name: string;
    readonly configAsYaml: string;
    readonly instances: {
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
        readonly services: {
            readonly containerState: string;
        }[];
    }[];
    readonly deployKeys: {
        readonly id: string;
        readonly cloneUrl: string;
        readonly fingerprint: string;
        readonly updatedAt: string;
    }[];
    readonly predictedEnvVariables: {
        readonly name: string;
        readonly value?: string;
        readonly pattern?: string;
    }[];
    readonly predictedFeaterVariables: {
        readonly name: string;
        readonly value?: string;
        readonly pattern?: string;
    }[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface GetDefinitionDetailQueryInterface {
    readonly definition: GetDefinitionDetailQueryDefinitionFieldInterface;
}
