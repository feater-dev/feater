module.exports = [
    {
        name: 'util.tokenGenerator',
        dependencies: [],
        module: require(__dirname + '/token-generator')
    },
    {
        name: 'validator',
        dependencies: [],
        module: require(__dirname + '/validator')
    },
    {
        name: 'mongodb.helper',
        dependencies: ['config'],
        module: require(__dirname + '/mongodb-helper')
    },
    {
        name: 'mongodb.repository.user',
        dependencies: ['mongodb.helper'],
        module: require(__dirname + '/repositories/user-repository')
    },
    {
        name: 'mongodb.repository.project',
        dependencies: ['mongodb.helper'],
        module: require(__dirname + '/repositories/project-repository')
    },
    {
        name: 'mongodb.repository.buildDefinition',
        dependencies: ['mongodb.helper'],
        module: require(__dirname + '/repositories/build-definition-repository')
    },
    {
        name: 'mongodb.repository.buildInstance',
        dependencies: ['mongodb.helper'],
        module: require(__dirname + '/repositories/build-instance-repository')
    },
    {
        name: 'github.apiClient',
        dependencies: ['config'],
        module: require(__dirname + '/github-api-client')
    },
    {
        name: 'routes.auth.google',
        dependencies: [],
        module: require(__dirname + '/routes/auth/google')
    },
    {
        name: 'instantiation.interpolationHelper',
        dependencies: [],
        module: require(__dirname + '/instantiation/interpolation-helper')
    },
    {
        name: 'instantiation.consoleLogger',
        dependencies: [],
        module: require(__dirname + '/instantiation/console-logger')
    },
    {
        name: 'instantiation.portProvider',
        dependencies: [],
        module: require(__dirname + '/instantiation/port-provider')
    },
    {
        name: 'instantiation.instanceClasses',
        dependencies: ['instantiation.consoleLogger'],
        module: require(__dirname + '/instantiation/instance-classes')
    },

    {
        name: 'instantiation.job.baseClasses',
        dependencies: [],
        module: require(__dirname + '/instantiation/job/base-classes')
    },
    {
        name: 'instantiation.job.resolveReference',
        dependencies: [
            'instantiation.job.baseClasses',
            'github.apiClient'
        ],
        module: require(__dirname + '/instantiation/job/resolve-reference')
    },
    {
        name: 'instantiation.job.createDirectory',
        dependencies: [
            'instantiation.job.baseClasses'
        ],
        module: require(__dirname + '/instantiation/job/create-directory')
    },
    {
        name: 'instantiation.job.downloadArchive',
        dependencies: [
            'config',
            'instantiation.job.baseClasses'
        ],
        module: require(__dirname + '/instantiation/job/download-archive')
    },
    {
        name: 'instantiation.job.extractArchive',
        dependencies: [
            'instantiation.job.baseClasses'
        ],
        module: require(__dirname + '/instantiation/job/extract-archive')
    },
    {
        name: 'instantiation.job.providePort',
        dependencies: [
            'instantiation.job.baseClasses',
            'instantiation.portProvider',
            'mongodb.repository.buildInstance'
        ],
        module: require(__dirname + '/instantiation/job/provide-port')
    },
    {
        name: 'instantiation.job.copyBeforeBuildTask',
        dependencies: [
            'instantiation.job.baseClasses'
        ],
        module: require(__dirname + '/instantiation/job/copy-before-build-task')
    },
    {
        name: 'instantiation.job.interpolateBeforeBuildTask',
        dependencies: [
            'instantiation.job.baseClasses',
            'instantiation.interpolationHelper'
        ],
        module: require(__dirname + '/instantiation/job/interpolate-before-build-task')
    },
    {
        name: 'instantiation.job.prepareEnvironmentalVariables',
        dependencies: [
            'instantiation.job.baseClasses',
            'instantiation.interpolationHelper',
            'mongodb.repository.buildInstance'
        ],
        module: require(__dirname + '/instantiation/job/prepare-environmental-variables')
    },
    {
        name: 'instantiation.job.prepareSummaryItems',
        dependencies: [
            'instantiation.job.baseClasses',
            'instantiation.interpolationHelper',
            'mongodb.repository.buildInstance'
        ],
        module: require(__dirname + '/instantiation/job/prepare-summary-items')
    },
    {
        name: 'instantiation.job.runDockerCompose',
        dependencies: [
            'instantiation.job.baseClasses'
        ],
        module: require(__dirname + '/instantiation/job/run-docker-compose')
    },

    {
        name: 'instantiation.job.executor',
        dependencies: [],
        module: require(__dirname + '/instantiation/job/executor')
    },

    {
        name: 'instantiation.jobs',
        dependencies: [
            'instantiation.job.resolveReference',
            'instantiation.job.createDirectory',
            'instantiation.job.downloadArchive',
            'instantiation.job.extractArchive',
            'instantiation.job.providePort',
            'instantiation.job.copyBeforeBuildTask',
            'instantiation.job.interpolateBeforeBuildTask',
            'instantiation.job.prepareEnvironmentalVariables',
            'instantiation.job.prepareSummaryItems',
            'instantiation.job.runDockerCompose',
            'instantiation.job.executor'
        ],
        module: require(__dirname + '/instantiation/jobs')
    },

    {
        name: 'instantiation.sourceCodeFetcher',
        dependencies: ['config', 'instantiation.instanceClasses', 'instantiation.jobs'],
        module: require(__dirname + '/instantiation/source-code-fetcher')
    },
    {
        name: 'routes.api.project',
        dependencies: ['mongodb.repository.project', 'validator'],
        module: require(__dirname + '/routes/api/project')
    },
    {
        name: 'routes.api.buildDefinition',
        dependencies: ['mongodb.repository.buildDefinition', 'mongodb.repository.project', 'validator'],
        module: require(__dirname + '/routes/api/build-definition')
    },
    {
        name: 'routes.api.buildInstance',
        dependencies: ['mongodb.repository.buildInstance', 'mongodb.repository.buildDefinition', 'mongodb.repository.project', 'instantiation.sourceCodeFetcher', 'validator'],
        module: require(__dirname + '/routes/api/build-instance')
    }
];
