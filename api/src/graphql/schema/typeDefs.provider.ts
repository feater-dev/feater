export const typeDefsProvider = {
    provide: 'TypeDefsProvider',
    useValue: `
        scalar JSON

         {
            query: Query
            mutation: Mutation
        }

        type Query {
            users(
                limit: Int
                offset: Int
                sortKey: String
                name: String
            ): [User!]!

            projects(
                limit: Int
                offset: Int
                sortKey: String
                name: String
            ): [Project!]!

            project(
                id: String!
            ): Project!

            definitions(
                limit: Int
                offset: Int
                sortKey: String
                name: String
                projectId: String
            ): [Definition!]!

            definition(
                id: String!
            ): Definition!

            instances(
                limit: Int
                offset: Int
                sortKey: String
                name: String
                projectId: String
                definitionId: String
            ): [Instance!]!

            instance(
                id: String!
            ): Instance!
        }

        input DefinitionConfigInput {
            sources: [SourceInput!]!
            proxiedPorts: [ProxiedPortInput!]!
            summaryItems: [SummaryItemInput!]!
            envVariables: [EnvVariableInput!]!
            composeFiles: [ComposeFileInput!]!
        }

        input SourceInput {
            id: String!
            type: String!
            name: String!
            reference: SourceReferenceInput!
            beforeBuildTasks: [BeforeBuildTaskInput!]!
        }

        input BeforeBuildTaskInput {
            type: String!
            sourceRelativePath: String
            destinationRelativePath: String
            relativePath: String
        }

        input SourceReferenceInput {
            type: String!
            name: String!
        }

        input ProxiedPortInput {
            id: String!
            serviceId: String!
            port: Int!
            name: String!
        }

        input SummaryItemInput {
            name: String!
            text: String!
        }

        input EnvVariableInput {
            name: String!
            value: String!
        }

        input ComposeFileInput {
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
            sources: [Source!]!
            proxiedPorts: [ProxiedPort!]!
            summaryItems: [SummaryItem!]!
            envVariables: [EnvVariable!]!
            composeFiles: [ComposeFile!]!
        }

        type Source {
            id: String!
            type: String!
            name: String!
            reference: SourceReference!
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

        type SourceReference {
            type: String!
            name: String!
        }

        type ProxiedPort {
            id: String!
            serviceId: String!
            port: Int!
            name: String!
        }

        type SummaryItem {
            name: String!
            text: String!
        }

        type EnvVariable {
            name: String!
            value: String!
        }

        type ComposeFile {
            sourceId: String!
            envDirRelativePath: String!
            composeFileRelativePaths: [String!]!
        }

        type InstanceService {
            id: String!
            cleanId: String!
            containerNamePrefix: String!
            containerId: String!
            ipAddress: String!
        }

        type InstanceEnvVariable {
            name: String!
            value: String!
        }

        type InstanceProxiedPort {
            id: String!
            serviceId: String!
            name: String!
            port: Int!
            proxyDomain: String!
        }

        type InstanceSummaryItem {
            name: String!
            text: String!
        }

        type Instance {
            id: String!
            name: String!
            definition: Definition!
            services: [InstanceService!]!
            envVariables: [InstanceEnvVariable!]!
            proxiedPorts: [InstanceProxiedPort!]!
            summaryItems: [InstanceSummaryItem!]!
        }
    `,
};
