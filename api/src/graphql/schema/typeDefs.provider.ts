export const typeDefsProvider = {
    provide: 'TypeDefsProvider',
    useValue: `
        scalar JSON

        schema {
            query: Query
            mutation: Mutation
        }

        type Query {
            users(
                limit: Int
                offset: Int
                sortKey: String
                username: String
            ): [User!]!
            projects(
                limit: Int
                offset: Int
                sortKey: String
                name: String
            ): [Project!]!
            definitions(
                limit: Int
                offset: Int
                sortKey: String
                name: String
                projectId: String
            ): [Definition!]!
            instances(
                limit: Int
                offset: Int
                sortKey: String
                name: String
                projectId: String
                definitionId: String
            ): [Instance!]!
        }

        input DefinitionConfigInput {
            sources: [DefinitionSourceInput!]!
            proxiedPorts: [DefinitionProxiedPortInput!]!
            summaryItems: [DefinitionSummaryItemInput!]!
            environmentalVariables: [DefinitionEnvironmentalVariableInput!]!
            composeFiles: [DefinitionComposeFileInput!]!
        }

        input DefinitionSourceInput {
            id: String!
            type: String!
            name: String!
            reference: DefinitionSourceReferenceInput!
            beforeBuildTasks: [BeforeBuildTaskInput!]!
        }

        input BeforeBuildTaskInput {
            type: String!
            sourceRelativePath: String
            destinationRelativePath: String
            relativePath: String
        }

        input DefinitionSourceReferenceInput {
            type: String!
            name: String!
        }

        input DefinitionProxiedPortInput {
            id: String!
            serviceId: String!
            port: Int!
            name: String!
        }

        input DefinitionSummaryItemInput {
            name: String!
            text: String!
        }

        input DefinitionEnvironmentalVariableInput {
            name: String!
            value: String!
        }

        input DefinitionComposeFileInput {
            sourceId: String!
            envDirRelativePath: String!
            composeFileRelativePaths: [String!]!
        }

        type Mutation {
            createProject(
                name: String!
            ): Project!

            createDefinition(
                projectId: String!
                name: String!
                config: DefinitionConfigInput!
            ): Definition!

            createInstance(
                definitionId: String!
                name: String!
            ): Instance!

            removeInstance(
                id: String!
            ): Boolean!
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
            definitions(
                limit: Int
                offset: Int
                sortKey: String
            ): [Definition!]!
        }

        type Definition {
            id: String!
            name: String!
            project: Project!
            instances(
                limit: Int
                offset: Int
                sortKey: String
            ): [Instance!]!
            config: DefinitionConfig!
        }

        type DefinitionConfig {
            sources: [DefinitionSource!]!
            proxiedPorts: [DefinitionProxiedPort!]!
            summaryItems: [DefinitionSummaryItem!]!
            environmentalVariables: [DefinitionEnvironmentalVariable!]!
            composeFiles: [DefinitionComposeFile!]!
        }

        type DefinitionSource {
            id: String!
            type: String!
            name: String!
            reference: DefinitionSourceReference!
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

        type DefinitionSourceReference {
            type: String!
            name: String!
        }

        type DefinitionProxiedPort {
            id: String!
            serviceId: String!
            port: Int!
            name: String!
        }

        type DefinitionSummaryItem {
            name: String!
            text: String!
        }

        type DefinitionEnvironmentalVariable {
            name: String!
            value: String!
        }

        type DefinitionComposeFile {
            sourceId: String!
            envDirRelativePath: String!
            composeFileRelativePaths: [String!]!
        }

        type Instance {
            id: String!
            name: String!
            definition: Definition!
        }
    `,
};
