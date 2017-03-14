module.exports = {

    projects: [
        {
            name: 'Nine Tenths A2M',
            mainRepository: {
                type: 'github',
                name: 'xsolve-pl/nine-tenths-a2m-api',
                base_path: null
            },
            deletedAt: 1482442261
        },
        {
            name: 'Nine Tenths A2M',
            mainRepository: {
                type: 'github',
                name: 'xsolve-pl/nine-tenths-a2m-api',
                base_path: null
            },
            deletedAt: 1482442261
        }
    ],

    buildDefinitions: [
        {
            projectId: 'e730be8e-1c5d-4f7c-9034-8ee47dae3d38',
            mainRepositoryReference: {
                branch: 'feature-payments'
            },
            componentRepositoryReferences: {
                api: {
                    branch: 'feature-payments'
                },
                spa: {
                    tag: 'v0.2.0-RC1'
                },
                admin_spa: {
                    commit: '3b372ac1ed670fddf69b4188486bd69f9767c484'
                }
            },
            paths: [
                {
                    component: 'api',
                    relativePath: null,
                    variableNames: ['A2M_API_DIRECTORY']
                }
            ],
            ports: [
                {
                    min: 80,
                    max: null,
                    variableNames: ['A2M_API_HTTP_PORT']
                }
            ]
        }
    ],

    buildInstances: [
        {
            buildDefinitionId: 'e730be8e-1c5d-4f7c-9034-8ee47dae3d38',
            mainRepositoryReference: {
                commit: '8486bd69f9767c4843b372ac1ed670fddf69b418'
            },
            componentRepositoryReferences: {
                api: {
                    commit: '8486bd69f9767c4843b372ac1ed670fddf69b418'
                },
                spa: {
                    commit: 'ac1ed670fddf69b4188486bd69f9767c4843b372'
                },
                admin_spa: {
                    commit: '3b372ac1ed670fddf69b4188486bd69f9767c484'
                }
            },
            basePath: '/srv/sites/feat/builds/EEdHypfLEPjfHatK',
            paths: [
                {
                    value: '/srv/sites/feat/builds/EEdHypfLEPjfHatK/api'
                }
            ],
            ports: [
                {
                    value: 87
                }
            ]
        }
    ]

};
