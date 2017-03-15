const Promise = require('bluebird');

module.exports = (buildDefinitionRepository, projectRepository, validator) => [
    {
        method: 'get',
        path: '/api/build-definition',
        middlewares: [
            (req, res) => {
                buildDefinitionRepository
                    .list({})
                    .then(buildDefinitions => {
                        buildDefinitions
                            .toArray()
                            .then(buildDefinition => {
                                res.json({ data: buildDefinition });
                            });
                    });
            }
        ]
    },
    {
        method: 'get',
        path: '/api/build-definition/:buildDefinitionId',
        middlewares: [
            ({ params }, res) => {
                const scope = {};

                function findDocument() {
                    return buildDefinitionRepository
                        .get(params.buildDefinitionId)
                        .then(document => {
                            if (null === document) {
                                res.status(404).send();

                                return;
                            }

                            scope.document = document;
                        });
                }

                function findProject() {
                    return projectRepository
                        .get(scope.document.projectId)
                        .then(project => {
                            if (null === project) {
                                res.status(404).send();

                                return;
                            }

                            scope.project = project;
                        });
                }

                function respondWithData() {
                    const data = JSON.parse(JSON.stringify(scope.document));
                    delete data.projectId;
                    data.project = {
                        _id: scope.project._id,
                        name: scope.project.name
                    };

                    res.json({ data });
                }

                function respondWithErrors(errors) {
                    console.log('ERRORS', errors);
                    res.status(400).send();
                }

                findDocument()
                    .then(findProject)
                    .then(respondWithData)
                    .catch(respondWithErrors);
            }
        ]
    },
    {
        method: 'post',
        path: '/api/build-definition',
        middlewares: [
            ({ body }, res) => {

                function validateRequest() {
                    return validator
                        .validate(body, 'api.buildDefinition.addBuildDefinition');
                }

                function validateConfig() {
                    const config = body.config; // TODO Handle errors.

                    return validator
                        .validate(config, 'buildDefinitionConfig.root')
                        .then(() => config);
                }

                function persistDocument([config]) {
                    const buildDefinitionDocument = {
                        projectId: body.projectId,
                        name: body.name,
                        config
                    };

                    return buildDefinitionRepository
                        .add(buildDefinitionDocument)
                }

                function respondWithId(id) {
                    res.status(201).json({ data: { id } });
                }

                function respondWithErrors(errors) {
                    console.log('ERRORS', errors);
                    res.status(400).send();
                }

                validateRequest()
                    .then(() => Promise.all([
                    validateConfig(),
                    projectRepository.getOrFail(body.projectId)
                ]))
                    .then(persistDocument)
                    .then(respondWithId)
                    .catch(respondWithErrors);
            }
        ]
    }
];
