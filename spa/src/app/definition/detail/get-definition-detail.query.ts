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
    id: string;
    project: {
        id: string;
        name: string;
    };
    name: string;
    configAsYaml: string;
    instances: {
        id: string;
        hash: string;
        name: string;
        definition: {
            id: string;
            name: string;
            project: {
                id: string;
                name: string;
            }
        }
        createdAt: string;
        updatedAt: string;
        completedAt: string;
        faliedAt: string;
        services: {
            containerState: string;
        }[];
    }[];
    deployKeys: {
        id: string;
        cloneUrl: string;
        fingerprint: string;
        updatedAt: string;
    }[];
    predictedEnvVariables: {
        name: string;
        value?: string;
        pattern?: string;
    }[];
    predictedFeaterVariables: {
        name: string;
        value?: string;
        pattern?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface GetDefinitionDetailQueryInterface {
    definition: GetDefinitionDetailQueryDefinitionFieldInterface;
}
