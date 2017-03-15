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
        name: 'instantiation.jobs',
        dependencies: ['config', 'instantiation.portProvider', 'instantiation.interpolationHelper', 'mongodb.repository.buildInstance', 'github.apiClient'],
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
