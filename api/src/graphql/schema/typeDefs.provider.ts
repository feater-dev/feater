export const typeDefsProvider = {
    provide: 'TypeDefsProvider',
    useValue: `
        scalar JSON

         {
            query: Query
            mutation: Mutation
        }

        type Query {
            publicSshKey: String

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

            asset(
                id: String!
            ): Asset!
        }

        input DefinitionConfigInput {
            sources: [SourceInput!]!
            proxiedPorts: [ProxiedPortInput!]!
            envVariables: [EnvVariableInput!]!
            composeFiles: [ComposeFileInput!]!
            afterBuildTasks: [AfterBuildTaskInput!]!
            summaryItems: [SummaryItemInput!]!
        }

        input SourceInput {
            id: String!
            sshCloneUrl: String!
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

        input EnvVariableInput {
            name: String!
            value: String!
        }

        input ComposeFileInput {
            sourceId: String!
            envDirRelativePath: String!
            composeFileRelativePaths: [String!]!
        }

        input AfterBuildTaskInput {
            type: String!
            customEnvVariables: [AfterBuildTaskInputCustomEnvVariable]
            inheritedEnvVariables: [AfterBuildTaskInputInheritedEnvVariable]
            command: [String!]
            serviceId: String
            assetId: String
            destinationPath: String
        }

        input AfterBuildTaskInputCustomEnvVariable {
            name: String!
            value: String!
        }

        input AfterBuildTaskInputInheritedEnvVariable {
            name: String!
            alias: String
        }

        input SummaryItemInput {
            name: String!
            text: String!
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

            createAsset(
                projectId: String!
                id: String!
                description: String
            ): Asset!

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
            assets(
                limit: Int
                offset: Int
                sortKey: String
            ): [Asset!]!
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
            envVariables: [EnvVariable!]!
            composeFiles: [ComposeFile!]!
            afterBuildTasks: [AfterBuildTask]!
            summaryItems: [SummaryItem!]!
        }

        type Source {
            id: String!
            sshCloneUrl: String!
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

        type AfterBuildTaskCustomEnvVariable {
            name: String!
            value: String!
        }

        type AfterBuildTaskInheritedEnvVariable {
            name: String!
            alias: String
        }

        union AfterBuildTask = ExecuteHostCommandAfterBuildTask | ExecuteServiceCommandAfterBuildTask | CopyAssetIntoContainerAfterBuildTask

        type ExecuteHostCommandAfterBuildTask {
            type: String!
            customEnvVariables: [AfterBuildTaskCustomEnvVariable]!
            inheritedEnvVariables: [AfterBuildTaskInheritedEnvVariable]!
            command: [String!]!
        }

        type ExecuteServiceCommandAfterBuildTask {
            type: String!
            serviceId: String!
            customEnvVariables: [AfterBuildTaskCustomEnvVariable]!
            inheritedEnvVariables: [AfterBuildTaskInheritedEnvVariable]!
            command: [String!]!
        }

        type CopyAssetIntoContainerAfterBuildTask {
            type: String!
            serviceId: String!
            assetId: String!
            destinationPath: String!
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

        type Asset {
            id: String!
            description: String
            project: Project!
            createdAt: String!
        }

        type InstanceService {
            id: String!
            cleanId: String!
            containerNamePrefix: String!
            containerId: String
            ipAddress: String
            containerState: String
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

        type InstanceLog {
            createdAt: String!
            message: String!
        }

        type Instance {
            id: String!
            name: String!
            definition: Definition!
            services: [InstanceService!]!
            envVariables: [InstanceEnvVariable!]!
            proxiedPorts: [InstanceProxiedPort!]!
            summaryItems: [InstanceSummaryItem!]!
            createdAt: String!
            logs: [InstanceLog!]!
        }
    `,
};
