module.exports = [
    {
        name: 'util.tokenGenerator',
        dependencies: [],
        implementation: require('./token-generator')
    },
    {
        name: 'validator',
        dependencies: [],
        implementation: require('./validator')
    },
    {
        name: 'mongodb.helper',
        dependencies: ['config'],
        implementation: require('./mongodb-helper')
    },
    {
        name: 'mongodb.repository.user',
        dependencies: ['mongodb.helper'],
        implementation: require('./repositories/user-repository')
    },
    {
        name: 'mongodb.repository.project',
        dependencies: ['mongodb.helper'],
        implementation: require('./repositories/project-repository')
    },
    {
        name: 'mongodb.repository.buildDefinition',
        dependencies: ['mongodb.helper'],
        implementation: require('./repositories/build-definition-repository')
    },
    {
        name: 'mongodb.repository.build',
        dependencies: ['mongodb.helper'],
        implementation: require('./repositories/build-instance-repository')
    },
    {
        name: 'github.apiClient',
        dependencies: ['config'],
        implementation: require('./github-api-client')
    },
    {
        name: 'routes.auth.google',
        dependencies: [],
        implementation: require('./routes/auth/google')
    },
    {
        name: 'instantiation.interpolationHelper',
        dependencies: [
            'config'
        ],
        implementation: require('./instantiation/interpolation-helper')
    },
    {
        name: 'instantiation.consoleLogger',
        dependencies: [],
        implementation: require('./instantiation/console-logger')
    },
    {
        name: 'instantiation.buildClasses',
        dependencies: [],
        implementation: require('./instantiation/build-classes')
    },

    {
        name: 'instantiation.jobsList',
        dependencies: [],
        implementation: require('./instantiation/jobs-list')
    },
    {
        name: 'instantiation.jobExecutorsCollection',
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
            'instantiation.executor'
        ],
        implementation: require('./instantiation/job-executors-collection')
    },
    {
        name: 'instantiation.job.baseClasses',
        dependencies: [],
        implementation: require('./instantiation/job/base-classes')
    },
    {
        name: 'instantiation.job.resolveReference',
        dependencies: [
            'instantiation.job.baseClasses',
            'github.apiClient'
        ],
        implementation: require('./instantiation/job/resolve-reference')
    },
    {
        name: 'instantiation.job.createDirectory',
        dependencies: [
            'config',
            'instantiation.job.baseClasses'
        ],
        implementation: require('./instantiation/job/create-directory')
    },
    {
        name: 'instantiation.job.downloadSource',
        dependencies: [
            'config',
            'instantiation.job.baseClasses'
        ],
        implementation: require('./instantiation/job/download-source')
    },
    {
        name: 'instantiation.job.extractSource',
        dependencies: [
            'instantiation.job.baseClasses'
        ],
        implementation: require('./instantiation/job/extract-source')
    },
    {
        name: 'instantiation.job.copyBeforeBuildTask',
        dependencies: [
            'instantiation.job.baseClasses'
        ],
        implementation: require('./instantiation/job/copy-before-build-task')
    },
    {
        name: 'instantiation.job.interpolateBeforeBuildTask',
        dependencies: [
            'instantiation.job.baseClasses',
            'instantiation.interpolationHelper'
        ],
        implementation: require('./instantiation/job/interpolate-before-build-task')
    },
    {
        name: 'instantiation.job.prepareEnvironmentalVariables',
        dependencies: [
            'instantiation.job.baseClasses',
            'instantiation.interpolationHelper',
            'mongodb.repository.build'
        ],
        implementation: require('./instantiation/job/prepare-environmental-variables')
    },
    {
        name: 'instantiation.job.prepareSummaryItems',
        dependencies: [
            'instantiation.job.baseClasses',
            'instantiation.interpolationHelper',
            'mongodb.repository.build'
        ],
        implementation: require('./instantiation/job/prepare-summary-items')
    },
    {
        name: 'instantiation.job.parseDockerCompose',
        dependencies: [
            'config',
            'instantiation.job.baseClasses',
            'mongodb.repository.build'
        ],
        implementation: require('./instantiation/job/parse-docker-compose')
    },
    {
        name: 'instantiation.job.runDockerCompose',
        dependencies: [
            'instantiation.job.baseClasses'
        ],
        implementation: require('./instantiation/job/run-docker-compose')
    },
    {
        name: 'instantiation.job.getContainerIds',
        dependencies: [
            'instantiation.job.baseClasses',
            'mongodb.repository.build'
        ],
        implementation: require('./instantiation/job/get-container-ids')
    },
    {
        name: 'instantiation.job.connectContainersToNetwork',
        dependencies: [
            'instantiation.job.baseClasses',
            'mongodb.repository.build'
        ],
        implementation: require('./instantiation/job/connect-containers-to-network')
    },
    {
        name: 'instantiation.job.preparePortDomains',
        dependencies: [
            'config',
            'instantiation.job.baseClasses',
            'mongodb.repository.build'
        ],
        implementation: require('./instantiation/job/prepare-port-domains')
    },
    {
        name: 'instantiation.job.proxyPortDomains',
        dependencies: [
            'config',
            'instantiation.job.baseClasses',
            'mongodb.repository.build'
        ],
        implementation: require('./instantiation/job/proxy-port-domains')
    },

    {
        name: 'instantiation.executor',
        dependencies: [],
        implementation: require('./instantiation/executor')
    },

    {
        name: 'instantiation.instantiation',
        dependencies: [
            'instantiation.jobExecutorsCollection',
            'instantiation.jobsList',
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
            'instantiation.job.proxyPortDomains'
        ],
        implementation: require('./instantiation/instantiation')
    },

    {
        name: 'instantiation.sourceCodeFetcher',
        dependencies: ['config', 'instantiation.buildClasses', 'instantiation.instantiation'],
        implementation: require('./instantiation/source-code-fetcher')
    },
    {
        name: 'routes.api.project',
        dependencies: [
            'steps.mapBuilder',
            'steps.mapRunner',
            'mongodb.repository.project',
            'validator'
        ],
        implementation: require('./routes/api/project')
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
        implementation: require('./routes/api/build-definition')
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
        implementation: require('./routes/api/build-instance')
    },
    {
        name: 'steps.mapBuilder',
        dependencies: [
            'mongodb.repository.project',
            'mongodb.repository.buildDefinition',
            'mongodb.repository.build'
        ],
        implementation: require('./routes/api/steps-map-builder')
    },
    {
        name: 'steps.mapRunner',
        dependencies: [],
        implementation: require('./helper/steps-map-runner')
    }
];
