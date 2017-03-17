module.exports = [
    {
        name: 'util.tokenGenerator',
        dependencies: [],
        require: __dirname + '/token-generator'
    },
    {
        name: 'validator',
        dependencies: [],
        require: __dirname + '/validator'
    },
    {
        name: 'mongodb.helper',
        dependencies: ['config'],
        require: __dirname + '/mongodb-helper'
    },
    {
        name: 'mongodb.repository.user',
        dependencies: ['mongodb.helper'],
        require: __dirname + '/repositories/user-repository'
    },
    {
        name: 'mongodb.repository.project',
        dependencies: ['mongodb.helper'],
        require: __dirname + '/repositories/project-repository'
    },
    {
        name: 'mongodb.repository.buildDefinition',
        dependencies: ['mongodb.helper'],
        require: __dirname + '/repositories/build-definition-repository'
    },
    {
        name: 'mongodb.repository.buildInstance',
        dependencies: ['mongodb.helper'],
        require: __dirname + '/repositories/build-instance-repository'
    },
    {
        name: 'github.apiClient',
        dependencies: ['config'],
        require: __dirname + '/github-api-client'
    },
    {
        name: 'routes.auth.google',
        dependencies: [],
        require: __dirname + '/routes/auth/google'
    },
    {
        name: 'instantiation.interpolationHelper',
        dependencies: [],
        require: __dirname + '/instantiation/interpolation-helper'
    },
    {
        name: 'instantiation.consoleLogger',
        dependencies: [],
        require: __dirname + '/instantiation/console-logger'
    },
    {
        name: 'instantiation.portProvider',
        dependencies: [],
        require: __dirname + '/instantiation/port-provider'
    },
    {
        name: 'instantiation.instanceClasses',
        dependencies: ['instantiation.consoleLogger'],
        require: __dirname + '/instantiation/instance-classes'
    },
    {
        name: 'instantiation.jobs',
        dependencies: ['config', 'instantiation.portProvider', 'instantiation.interpolationHelper', 'mongodb.repository.buildInstance', 'github.apiClient'],
        require: __dirname + '/instantiation/jobs'
    },
    {
        name: 'instantiation.sourceCodeFetcher',
        dependencies: ['config', 'instantiation.instanceClasses', 'instantiation.jobs'],
        require: __dirname + '/instantiation/source-code-fetcher'
    },
    {
        name: 'routes.api.project',
        dependencies: ['mongodb.repository.project', 'validator'],
        require: __dirname + '/routes/api/project'
    },
    {
        name: 'routes.api.buildDefinition',
        dependencies: ['mongodb.repository.buildDefinition', 'mongodb.repository.project', 'validator'],
        require: __dirname + '/routes/api/build-definition'
    },
    {
        name: 'routes.api.buildInstance',
        dependencies: ['mongodb.repository.buildInstance', 'mongodb.repository.buildDefinition', 'mongodb.repository.project', 'instantiation.sourceCodeFetcher', 'validator'],
        require: __dirname + '/routes/api/build-instance'
    }
];
