export const typeDefsProvider = {
    provide: 'TypeDefsProvider',
    useValue: `
        scalar JSON

        schema {
            query: Query
        }

        type Query {
            hello: String!
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

        type BuildInstance {
            id: String!
            name: String!
            buildDefinition: BuildDefinition!
        }
    `,
};
