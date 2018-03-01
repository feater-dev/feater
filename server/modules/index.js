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
            'config',
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
        name: 'instantiation.job.parseDockerCompose',
        dependencies: [
            'config',
            'instantiation.job.baseClasses',
            'mongodb.repository.buildInstance'
        ],
        module: require(__dirname + '/instantiation/job/parse-docker-compose')
    },
    {
        name: 'instantiation.job.runDockerCompose',
        dependencies: [
            'instantiation.job.baseClasses'
        ],
        module: require(__dirname + '/instantiation/job/run-docker-compose')
    },
    {
        name: 'instantiation.job.getContainerIds',
        dependencies: [
            'instantiation.job.baseClasses',
            'mongodb.repository.buildInstance'
        ],
        module: require(__dirname + '/instantiation/job/get-container-ids')
    },
    {
        name: 'instantiation.job.connectContainersToNetwork',
        dependencies: [
            'instantiation.job.baseClasses',
            'mongodb.repository.buildInstance'
        ],
        module: require(__dirname + '/instantiation/job/connect-containers-to-network')
    },
    {
        name: 'instantiation.job.preparePortDomains',
        dependencies: [
            'config',
            'instantiation.job.baseClasses',
            'mongodb.repository.buildInstance'
        ],
        module: require(__dirname + '/instantiation/job/prepare-port-domains')
    },
    {
        name: 'instantiation.job.proxyPortDomains',
        dependencies: [
            'config',
            'instantiation.job.baseClasses',
            'mongodb.repository.buildInstance'
        ],
        module: require(__dirname + '/instantiation/job/proxy-port-domains')
    },

    {
        name: 'instantiation.job.executor',
        dependencies: [],
        module: require(__dirname + '/instantiation/job/executor')
    },

    {
        name: 'instantiation.job.runners',
        dependencies: [],
        module: require(__dirname + '/instantiation/job/runners')
    },

    {
        name: 'instantiation.jobs',
        dependencies: [
            'instantiation.job.resolveReference',
            'instantiation.job.createDirectory',
            'instantiation.job.downloadArchive',
            'instantiation.job.extractArchive',
            'instantiation.job.copyBeforeBuildTask',
            'instantiation.job.interpolateBeforeBuildTask',
            'instantiation.job.prepareEnvironmentalVariables',
            'instantiation.job.prepareSummaryItems',
            'instantiation.job.parseDockerCompose',
            'instantiation.job.runDockerCompose',
            'instantiation.job.getContainerIds',
            'instantiation.job.connectContainersToNetwork',
            'instantiation.job.preparePortDomains',
            'instantiation.job.proxyPortDomains',
            'instantiation.job.executor',
            'instantiation.job.runners'
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
        dependencies: [
            'steps.mapBuilder',
            'steps.mapRunner',
            'mongodb.repository.project',
            'validator'
        ],
        module: require(__dirname + '/routes/api/project')
    },
    {
        name: 'routes.api.buildDefinition',
        dependencies: [
            'steps.mapBuilder',
            'steps.mapRunner',
            'mongodb.repository.buildDefinition',
            'mongodb.repository.project',
            'validator'
        ],
        module: require(__dirname + '/routes/api/build-definition')
    },
    {
        name: 'routes.api.buildInstance',
        dependencies: [
            'steps.mapBuilder',
            'steps.mapRunner',
            'mongodb.repository.buildInstance',
            'mongodb.repository.buildDefinition',
            'mongodb.repository.project',
            'instantiation.sourceCodeFetcher',
            'validator'
        ],
        module: require(__dirname + '/routes/api/build-instance')
    },
    {
        name: 'steps.mapBuilder',
        dependencies: [
            'mongodb.repository.project',
            'mongodb.repository.buildDefinition',
            'mongodb.repository.buildInstance'
        ],
        module: require(__dirname + '/routes/api/steps-map-builder')
    },
    {
        name: 'steps.mapRunner',
        dependencies: [],
        module: require(__dirname + '/helper/steps-map-runner')
    }
];
