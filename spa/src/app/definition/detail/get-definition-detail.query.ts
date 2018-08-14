import gql from 'graphql-tag';


export const getDefinitionDetailQueryGql = gql`
    query ($id: String!) {
        publicSshKey
        definition(id: $id) {
            id
            project {
                id
                name
            }
            name
            config {
                sources {
                    id
                    sshCloneUrl
                    reference {
                        type
                        name
                    }
                    beforeBuildTasks {
                        ... on CopyBeforeBuildTask {
                                type
                                sourceRelativePath
                                destinationRelativePath
                            }
                        ... on InterpolateBeforeBuildTask {
                                type
                                relativePath
                            }
                    }
                }
                proxiedPorts {
                    id
                    serviceId
                    name
                    port
                }
                envVariables {
                    name
                    value
                }
                composeFiles {
                    sourceId
                    envDirRelativePath
                    composeFileRelativePaths
                }
                afterBuildTasks {
                    ... on ExecuteHostCommandAfterBuildTask {
                        type
                        customEnvVariables {
                            name
                            value
                        }
                        inheritedEnvVariables {
                            name
                            alias
                        }
                        command
                    }
                    ... on ExecuteServiceCommandAfterBuildTask {
                        type
                        serviceId
                        customEnvVariables {
                            name
                            value
                        }
                        inheritedEnvVariables {
                            name
                            alias
                        }
                        command
                    }
               }
                summaryItems {
                    name
                    text
                }
            }
            instances {
                id
                name
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
    config: any; // TODO Define in this interface.
    instances: [
        {
            readonly id: string;
            readonly name: string;
        }
    ];
}

export interface GetDefinitionDetailQueryInterface {
    publicSshKey: string;
    definition: GetDefinitionDetailQueryDefinitionFieldInterface;
}
