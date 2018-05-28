export const typeDefsProvider = {
    provide: 'TypeDefsProvider',
    useValue: `
        scalar JSON

        schema {
            query: Query
            mutation: Mutation
        }

        type Query {
            users: [User!]!
            projects: [Project!]!
            buildDefinitions: [BuildDefinition!]!
            buildInstances: [BuildInstance!]!
        }

        input BuildDefinitionConfigInput {
            sources: [BuildDefinitionSourceInput!]!
            proxiedPorts: [BuildDefinitionProxiedPortInput!]!
            summaryItems: [BuildDefinitionSummaryItemInput!]!
            environmentalVariables: [BuildDefinitionEnvironmentalVariableInput!]!
            composeFiles: [BuildDefinitionComposeFileInput!]!
        }

        input BuildDefinitionSourceInput {
            id: String!
            type: String!
            name: String!
            reference: BuildDefinitionSourceReferenceInput!
            beforeBuildTasks: [BeforeBuildTaskInput!]!
        }

        input BeforeBuildTaskInput {
            type: String!
            sourceRelativePath: String
            destinationRelativePath: String
            relativePath: String
        }

        input BuildDefinitionSourceReferenceInput {
            type: String!
            name: String!
        }

        input BuildDefinitionProxiedPortInput {
            id: String!
            containerName: String!
            port: Int!
            name: String!
        }

        input BuildDefinitionSummaryItemInput {
            name: String!
            text: String!
        }

        input BuildDefinitionEnvironmentalVariableInput {
            name: String!
            value: String!
        }

        input BuildDefinitionComposeFileInput {
            sourceId: String!
            relativePaths: [String!]!
        }

        type Mutation {
            createProject(
                name: String!
            ): Project!
            createBuildDefinition(
                projectId: String!
                name: String!
                config: BuildDefinitionConfigInput!
            ): BuildDefinition!
        }

        type User {
            id: String!
            name: String!
            githubProfile: GithubProfile
            googleProfile: GoogleProfile
        }

        type GithubProfile {
            username: String!
            id: String!
            displayName: String!
            emailAddresses: [String!]!
        }

        type GoogleProfile {
            id: String!
            firstName: String!
            lastName: String!
            displayName: String!
            emailAddress: String!
            domain: String!
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
            beforeBuildTasks: [BeforeBuildTask!]!
        }

        union BeforeBuildTask = CopyBeforeBuildTask | InterpolateBeforeBuildTask

        type CopyBeforeBuildTask {
            type: String!
            sourceRelativePath: String!
            destinationRelativePath: String!
        }

        type InterpolateBeforeBuildTask {
            type: String!
            relativePath: String!
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
