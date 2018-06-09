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
            config {
                sources {
                    id
                    type
                    name
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
                composeFiles {
                    sourceId
                    envDirRelativePath
                    composeFileRelativePaths
                }
                summaryItems {
                    name
                    text
                }
                envVariables {
                    name
                    value
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
    instances: [{
        readonly id: string;
        readonly name: string;
    }];
}

export interface GetDefinitionDetailQueryInterface {
    definition: GetDefinitionDetailQueryDefinitionFieldInterface;
}
