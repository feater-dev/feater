export const typeDefsProvider = {
    provide: 'TypeDefsProvider',
    useValue: `
        scalar JSON

         {
            query: Query
            mutation: Mutation
        }

        type Query {
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

            assets(
                limit: Int
                offset: Int
                sortKey: String
                id: String
                projectId: String
            ): [Asset!]!

            asset(
                projectId: String!
                id: String!
            ): Asset!

            deployKeys(
                limit: Int
                offset: Int
                sortKey: String
                name: String
            ): [DeployKey!]!

            deployKey(
                id: String!
            ): DeployKey!
        }

        input DefinitionConfigInput {
            sources: [SourceInput!]!
            volumes: [VolumeInput!]!
            proxiedPorts: [ProxiedPortInput!]!
            envVariables: [EnvVariableInput!]!
            composeFiles: [ComposeFileInput!]!
            afterBuildTasks: [AfterBuildTaskInput!]!
            summaryItems: [SummaryItemInput!]!
        }

        input SourceInput {
            id: String!
            cloneUrl: String!
            reference: SourceReferenceInput!
            beforeBuildTasks: [BeforeBuildTaskInput!]!
        }

        input VolumeInput {
            id: String!
            assetId: String
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
            id: String
            dependsOn: [String]
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
            value: String!
        }

        type Mutation {
            createProject(
                name: String!
            ): Project

            createDefinition(
                projectId: String!
                name: String!
                config: DefinitionConfigInput!
            ): Definition

            updateDefinition(
                id: String!
                name: String!
                config: DefinitionConfigInput!
            ): Definition

            removeDefinition(
                id: String!
            ): Boolean

            createAsset(
                projectId: String!
                id: String!
                description: String
            ): Asset

            removeAsset(
                projectId: String!
                id: String!
            ): Boolean

            createInstance(
                definitionId: String!
                name: String!
            ): Instance

            removeInstance(
                id: String!
            ): Boolean

            stopService(
                instanceId: String!
                serviceId: String!
            ): Instance

            pauseService(
                instanceId: String!
                serviceId: String!
            ): Instance

            startService(
                instanceId: String!
                serviceId: String!
            ): Instance

            unpauseService(
                instanceId: String!
                serviceId: String!
            ): Instance

            regenerateDeployKey(
                cloneUrl: String!
            ): DeployKey

            generateMissingDeployKeys: GenerateMissingDeployKeysResult

            removeUnusedDeployKeys: RemoveUnusedDeployKeysResult

            removeDeployKey(
                cloneUrl: String!
            ): RemoveDeployKeyResult
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
            createdAt: String!
            updatedAt: String!
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
            configAsYaml: String!
            deployKeys: [DeployKey!]!
            predictedEnvVariables: [PredictedEnvVariable]!
            predictedFeaterVariables: [PredictedFeaterVariable]!
            createdAt: String!
            updatedAt: String!
        }

        type DeployKey {
            id: String!
            cloneUrl: String!
            publicKey: String!
            fingerprint: String!
            createdAt: String!
            updatedAt: String!
        }

        type PredictedEnvVariable {
            name: String!
            value: String
            pattern: String
        }

        type PredictedFeaterVariable {
            name: String!
            value: String
            pattern: String
        }

        type DefinitionConfig {
            sources: [Source!]!
            volumes: [Volume!]!
            proxiedPorts: [ProxiedPort!]!
            envVariables: [EnvVariable!]!
            composeFiles: [ComposeFile!]!
            afterBuildTasks: [AfterBuildTask]!
            summaryItems: [SummaryItem!]!
        }

        type Volume {
            id: String!
            assetId: String
        }

        type Source {
            id: String!
            cloneUrl: String!
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

        union AfterBuildTask = ExecuteServiceCommandAfterBuildTask | CopyAssetIntoContainerAfterBuildTask

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
            value: String!
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
            updatedAt: String!
        }

        type InstanceService {
            id: String!
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
            domain: String!
        }

        type InstanceSummaryItem {
            name: String!
            value: String!
        }

        type InstanceCommandLogEntry {
            id: String!
            message: String!
            timestamp: String!
        }

        type InstanceCommandLog {
            id: String!
            description: String!
            createdAt: String!
            completedAt: String
            failedAt: String
            entries(
                afterId: String
            ): [InstanceCommandLogEntry!]!
        }

        type Instance {
            id: String!
            hash: String
            name: String!
            definition: Definition!
            services: [InstanceService!]
            envVariables: [InstanceEnvVariable!]
            proxiedPorts: [InstanceProxiedPort!]
            summaryItems: [InstanceSummaryItem!]
            createdAt: String
            updatedAt: String
            completedAt: String
            failedAt: String
            commandLogs: [InstanceCommandLog!]!
        }

        type RemoveDeployKeyResult {
            removed: Boolean!
        }

        type GenerateMissingDeployKeysResult {
            generated: Boolean!
        }

        type RemoveUnusedDeployKeysResult {
            removed: Boolean!
        }
    `,
};
