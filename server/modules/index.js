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
        name: 'mongodb.repository.build',
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
        dependencies: [
            'config'
        ],
        module: require(__dirname + '/instantiation/interpolation-helper')
    },
    {
        name: 'instantiation.consoleLogger',
        dependencies: [],
        module: require(__dirname + '/instantiation/console-logger')
    },
    {
        name: 'instantiation.buildClasses',
        dependencies: ['instantiation.consoleLogger'],
        module: require(__dirname + '/instantiation/build-classes')
    },

    {
        name: 'instantiation.job.job-classes',
        dependencies: [],
        module: require(__dirname + '/instantiation/job/job-classes')
    },
    {
        name: 'instantiation.job.resolveReference',
        dependencies: [
            'instantiation.job.job-classes',
            'github.apiClient'
        ],
        module: require(__dirname + '/instantiation/job/resolve-reference')
    },
    {
        name: 'instantiation.job.createDirectory',
        dependencies: [
            'config',
            'instantiation.job.job-classes'
        ],
        module: require(__dirname + '/instantiation/job/create-directory')
    },
    {
        name: 'instantiation.job.downloadSource',
        dependencies: [
            'config',
            'instantiation.job.job-classes'
        ],
        module: require(__dirname + '/instantiation/job/download-source')
    },
    {
        name: 'instantiation.job.extractSource',
        dependencies: [
            'instantiation.job.job-classes'
        ],
        module: require(__dirname + '/instantiation/job/extract-source')
    },
    {
        name: 'instantiation.job.copyBeforeBuildTask',
        dependencies: [
            'instantiation.job.job-classes'
        ],
        module: require(__dirname + '/instantiation/job/copy-before-build-task')
    },
    {
        name: 'instantiation.job.interpolateBeforeBuildTask',
        dependencies: [
            'instantiation.job.job-classes',
            'instantiation.interpolationHelper'
        ],
        module: require(__dirname + '/instantiation/job/interpolate-before-build-task')
    },
    {
        name: 'instantiation.job.prepareEnvironmentalVariables',
        dependencies: [
            'instantiation.job.job-classes',
            'instantiation.interpolationHelper',
            'mongodb.repository.build'
        ],
        module: require(__dirname + '/instantiation/job/prepare-environmental-variables')
    },
    {
        name: 'instantiation.job.prepareSummaryItems',
        dependencies: [
            'instantiation.job.job-classes',
            'instantiation.interpolationHelper',
            'mongodb.repository.build'
        ],
        module: require(__dirname + '/instantiation/job/prepare-summary-items')
    },
    {
        name: 'instantiation.job.parseDockerCompose',
        dependencies: [
            'config',
            'instantiation.job.job-classes',
            'mongodb.repository.build'
        ],
        module: require(__dirname + '/instantiation/job/parse-docker-compose')
    },
    {
        name: 'instantiation.job.runDockerCompose',
        dependencies: [
            'instantiation.job.job-classes'
        ],
        module: require(__dirname + '/instantiation/job/run-docker-compose')
    },
    {
        name: 'instantiation.job.getContainerIds',
        dependencies: [
            'instantiation.job.job-classes',
            'mongodb.repository.build'
        ],
        module: require(__dirname + '/instantiation/job/get-container-ids')
    },
    {
        name: 'instantiation.job.connectContainersToNetwork',
        dependencies: [
            'instantiation.job.job-classes',
            'mongodb.repository.build'
        ],
        module: require(__dirname + '/instantiation/job/connect-containers-to-network')
    },
    {
        name: 'instantiation.job.preparePortDomains',
        dependencies: [
            'config',
            'instantiation.job.job-classes',
            'mongodb.repository.build'
        ],
        module: require(__dirname + '/instantiation/job/prepare-port-domains')
    },
    {
        name: 'instantiation.job.proxyPortDomains',
        dependencies: [
            'config',
            'instantiation.job.job-classes',
            'mongodb.repository.build'
        ],
        module: require(__dirname + '/instantiation/job/proxy-port-domains')
    },

    {
        name: 'instantiation.job.executor',
        dependencies: [],
        module: require(__dirname + '/instantiation/job/executor')
    },

    {
        name: 'instantiation.instantiation',
        dependencies: [
            'instantiation.job.resolveReference',
            'instantiation.job.createDirectory',
            'instantiation.job.downloadSource',
            'instantiation.job.extractSource',
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
            'instantiation.job.executor'
        ],
        module: require(__dirname + '/instantiation/instantiation')
    },

    {
        name: 'instantiation.sourceCodeFetcher',
        dependencies: ['config', 'instantiation.buildClasses', 'instantiation.instantiation'],
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
        name: 'routes.api.build',
        dependencies: [
            'steps.mapBuilder',
            'steps.mapRunner',
            'mongodb.repository.build',
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
            'mongodb.repository.build'
        ],
        module: require(__dirname + '/routes/api/steps-map-builder')
    },
    {
        name: 'steps.mapRunner',
        dependencies: [],
        module: require(__dirname + '/helper/steps-map-runner')
    }
];
