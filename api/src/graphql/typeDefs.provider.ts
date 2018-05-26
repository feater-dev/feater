export const typeDefsProvider = {
    provide: 'TypeDefsProvider',
    useValue: `
        scalar JSON

        schema {
            query: Query
        }

        type Query {
            projects: [Project!]!
            buildDefinitions: [BuildDefinition!]!
            buildInstances: [BuildInstance!]!
        }

        type Project {
            id: String!
            name: String!
            buildDefinitions: [BuildDefinition!]!
        }

        type BuildDefinition {
            id: String!
            name: String!
            project: Project!
            buildInstances: [BuildInstance!]!
            config: BuildDefinitionConfig!
        }

        type BuildDefinitionConfig {
            sources: [BuildDefinitionSource!]!
            proxiedPorts: [BuildDefinitionProxiedPort!]!
            summaryItems: [BuildDefinitionSummaryItem!]!
            environmentalVariables: [BuildDefinitionEnvironmentalVariable!]!
            composeFiles: [BuildDefinitionComposeFile!]!
        }

        type BuildDefinitionSource {
            id: String!
            type: String!
            name: String!
            reference: BuildDefinitionSourceReference!
        }

        type BuildDefinitionSourceReference {
            type: String!
            name: String!
        }

        type BuildDefinitionProxiedPort {
            id: String!
            containerName: String!
            port: Int!
            name: String!
        }

        type BuildDefinitionSummaryItem {
            name: String!
            text: String!
        }

        type BuildDefinitionEnvironmentalVariable {
            name: String!
            value: String!
        }

        type BuildDefinitionComposeFile {
            sourceId: String!
            relativePaths: [String!]!
        }

        type BuildInstance {
            id: String!
            name: String!
            buildDefinition: BuildDefinition!
        }
    `,
};
